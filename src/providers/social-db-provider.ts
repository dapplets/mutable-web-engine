import { NearSigner } from "./near-signer";
import { ParserConfig } from "../core/parsers/json-parser";
import {
  BosUserLink,
  AppMetadata,
  DependantContext,
  IProvider,
  UserLinkId,
  AppMetadataTarget,
  AppId,
} from "./provider";
import { IContextNode } from "../core/tree/types";
import { generateGuid } from "../core/utils";
import { SocialDbClient } from "./social-db-client";
import { BosParserConfig } from "../core/parsers/bos-parser";
import { DappletsEngineNs } from "../constants";
import { sha256 } from "js-sha256";
import serializeToDeterministicJson from "json-stringify-deterministic";
import { SocialDbStorage } from "./social-db-storage";

const DappletsNamespace = "https://dapplets.org/ns/";
const SupportedParserTypes = ["json", "bos"];

const ProjectIdKey = "dapplets.near";
const ParserKey = "parser";
const SettingsKey = "settings";
const LinkKey = "link";
const SelfKey = "";
const ParserContextsKey = "contexts";
const AppKey = "app";
const WildcardKey = "*";
const RecursiveWildcardKey = "**";
const IndexesKey = "indexes";
const KeyDelimiter = "/";

/**
 * Source: https://gist.github.com/themikefuller/c1de46cbbdad02645b9dc006baedf88e
 */
function base64EncodeURL(
  byteArray: ArrayLike<number> | ArrayBufferLike
): string {
  return btoa(
    Array.from(new Uint8Array(byteArray))
      .map((val) => {
        return String.fromCharCode(val);
      })
      .join("")
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/\=/g, "");
}

/**
 * Hashes object using deterministic serializator, SHA-256 and base64url encoding
 */
function hashObject(obj: any): string {
  const json = serializeToDeterministicJson(obj);
  const hashBytes = sha256.create().update(json).arrayBuffer();
  return base64EncodeURL(hashBytes);
}

function getValueByKey(keys: string[], obj: any): any {
  const [firstKey, ...anotherKeys] = keys;
  if (anotherKeys.length === 0) {
    return obj[firstKey];
  } else {
    return getValueByKey(anotherKeys, obj[firstKey]);
  }
}

/**
 * All Mutable Web data is stored in the Social DB contract in `settings` namespace.
 * More info about the schema is here:
 * https://github.com/NearSocial/standards/blob/8713aed325226db5cf97ab9744ba78b561cc377b/types/settings/Settings.md
 *
 * Example of a data stored in the contract is here:
 * /docs/social-db-reference.json
 */
export class SocialDbProvider implements IProvider {
  // #client: SocialDbClient;
  #storage: SocialDbStorage;

  constructor(private _signer: NearSigner, _contractName: string) {
    const client = new SocialDbClient(_signer, _contractName);
    this.#storage = new SocialDbStorage(client);
  }

  // #region Read methods

  async getParserConfigsForContext(
    context: IContextNode
  ): Promise<(ParserConfig | BosParserConfig)[]> {
    // ToDo: implement adapters loading for another types of contexts
    if (context.namespaceURI !== DappletsEngineNs) return [];

    const contextHashKey = hashObject({
      namespace: context.namespaceURI,
      contextType: context.tagName,
      contextId: context.id,
    });

    const keys = [
      WildcardKey, // from any user
      SettingsKey,
      ProjectIdKey,
      ParserKey,
      WildcardKey, // any parser
      ParserContextsKey,
      contextHashKey,
    ];

    const availableKeys = await this.#client.keys([keys.join(KeyDelimiter)]);
    const parserKeys = availableKeys
      .map((key) => key.substring(0, key.lastIndexOf(KeyDelimiter))) // discard contextHashKey
      .map((key) => key.substring(0, key.lastIndexOf(KeyDelimiter))); // discard ParserContextsKey

    const queryResult = await this.#client.get(parserKeys);

    const parsers = [];

    for (const key of parserKeys) {
      const json = getValueByKey(key.split(KeyDelimiter), queryResult);
      parsers.push(JSON.parse(json));
    }

    return parsers;
  }

  async getParserConfig(
    ns: string
  ): Promise<ParserConfig | BosParserConfig | null> {
    const { accountId, parserLocalId } = this._extractParserIdFromNamespace(ns);

    const parser = await this.#storage.getById(
      `${accountId}/${ParserKey}/${parserLocalId}`
    );

    if (!parser?.[SelfKey]) return null;

    return JSON.parse(parser[SelfKey]);
  }

  async getAllAppIds(): Promise<string[]> {
    const keys = [WildcardKey, AppKey, WildcardKey];
    const apps = await this.#storage.getKeys(keys.join(KeyDelimiter));
    return apps;
  }

  async getAppsForContext(
    context: IContextNode,
    globalAppIds: AppId[]
  ): Promise<AppMetadata[]> {
    const allApps = await Promise.all(
      globalAppIds.map((id) => this.getApplication(id))
    );

    const suitableApps: AppMetadata[] = [];

    for (const app of allApps) {
      if (!app) continue;

      const suitableTargets = [];

      for (const target of app.targets) {
        if (!target.if) continue;

        const isSuitable = SocialDbProvider._tryFillAppTargetWithContext(
          target.if,
          app.namespaces,
          context
        );

        if (isSuitable) {
          suitableTargets.push(target);
        }
      }

      if (suitableTargets.length > 0) {
        suitableApps.push({ ...app, targets: suitableTargets });
      }
    }

    return suitableApps;
  }

  async getLinksForContext(
    context: IContextNode,
    globalAppIds: AppId[]
  ): Promise<BosUserLink[]> {
    const allApps = await Promise.all(
      globalAppIds.map((id) => this.getApplication(id))
    );

    const appLinks: BosUserLink[] = [];

    for (const app of allApps) {
      if (!app) continue;

      const targetByHash = new Map<string, AppMetadataTarget>();

      for (const target of app.targets) {
        const filledTarget = SocialDbProvider._tryFillAppTargetWithContext(
          target.if,
          app.namespaces,
          context
        );

        if (filledTarget) {
          targetByHash.set(hashObject(filledTarget), target);
        }
      }

      if (targetByHash.size === 0) return [];

      const keys = Array.from(targetByHash.keys()).map((hash) =>
        [
          WildcardKey, // from any user
          SettingsKey,
          ProjectIdKey,
          LinkKey,
          app.authorId,
          AppKey,
          app.appLocalId,
          WildcardKey, // any user link id
          IndexesKey,
          hash,
        ].join(KeyDelimiter)
      );

      const resp = await this.#client.keys(keys);

      appLinks.push(
        ...resp.map((key) => {
          const [authorId, , , , , , , id, , hash] = key.split(KeyDelimiter);
          const target = targetByHash.get(hash)!;

          const { alias, value: insertionPoint } =
            SocialDbProvider._parseNsValue(target.injectTo);

          return {
            id,
            namespace: alias ? app.namespaces[alias] : DappletsEngineNs, // ToDo: default ns?
            authorId,
            bosWidgetId: app.componentId,
            insertionPoint,
          }; // ToDo: add filter values?
        })
      );
    }

    return appLinks;
  }

  async getApplication(globalAppId: string): Promise<AppMetadata | null> {
    const [authorId, , appLocalId] = globalAppId.split(KeyDelimiter);

    const app = await this.#storage.getById(globalAppId);

    if (!app?.[SelfKey]) return null;

    return {
      ...JSON.parse(app[SelfKey]),
      id: globalAppId,
      appLocalId,
      authorId,
    };
  }

  // #endregion

  // #region Write methods

  async createLink(
    globalAppId: string,
    context: IContextNode
  ): Promise<BosUserLink> {
    const linkId = generateGuid();

    const accountId = await this._signer.getAccountId();

    if (!accountId) throw new Error("User is not logged in");

    const appMetadata = await this.getApplication(globalAppId);

    if (!appMetadata) {
      throw new Error("The app doesn't exist");
    }

    let filledTarget: Record<string, any> | null = null;
    let suitableTarget: AppMetadataTarget | null = null;

    for (const target of appMetadata.targets) {
      filledTarget = SocialDbProvider._tryFillAppTargetWithContext(
        target.if,
        appMetadata.namespaces,
        context
      );

      if (filledTarget) {
        suitableTarget = target;
        break;
      }
    }

    if (!filledTarget || !suitableTarget) {
      throw new Error("No suitable target found");
    }

    const index = hashObject(filledTarget);

    const keys = [
      accountId,
      SettingsKey,
      ProjectIdKey,
      LinkKey,
      appMetadata.authorId,
      AppKey,
      appMetadata.appLocalId,
      linkId,
    ];

    const storedAppLink = {
      indexes: {
        [index]: "",
      },
    };

    await this.#client.set(this._buildNestedData(keys, storedAppLink));

    const { alias, value: insertionPoint } = SocialDbProvider._parseNsValue(
      suitableTarget.injectTo
    );

    return {
      id: linkId,
      namespace: alias ? appMetadata.namespaces[alias] : DappletsEngineNs, // ToDo: default ns?
      authorId: accountId,
      bosWidgetId: appMetadata.componentId,
      insertionPoint,
      // indexes: [index]
    };
  }

  async deleteUserLink(linkId: UserLinkId): Promise<void> {
    const accountId = await this._signer.getAccountId();

    if (!accountId) throw new Error("User is not logged in");

    // ToDo: check link ownership?

    const keys = [
      accountId,
      SettingsKey,
      ProjectIdKey,
      LinkKey,
      WildcardKey, // any app author, ToDo: it works if linkId is globally unique
      AppKey,
      WildcardKey, // any app local id, ToDo: it works if linkId is globally unique
      linkId,
      RecursiveWildcardKey,
    ];

    await this.#storage.deleteById()
    await this.#client.delete([keys.join(KeyDelimiter)]);
  }

  async createApplication(
    appMetadata: Omit<AppMetadata, "authorId" | "appLocalId">
  ): Promise<AppMetadata> {
    const [authorId, , appLocalId] = appMetadata.id.split(KeyDelimiter);

    const keys = [authorId, SettingsKey, ProjectIdKey, AppKey, appLocalId];

    const storedAppMetadata = {
      [SelfKey]: JSON.stringify({
        namespaces: appMetadata.namespaces,
        componentId: appMetadata.componentId,
        targets: appMetadata.targets,
      }),
    };

    await this.#client.set(this._buildNestedData(keys, storedAppMetadata));

    return {
      ...appMetadata,
      appLocalId,
      authorId,
    };
  }

  async createParserConfig(config: ParserConfig): Promise<void> {
    const { accountId, parserLocalId } = this._extractParserIdFromNamespace(
      config.namespace
    );

    const keys = [
      accountId,
      SettingsKey,
      ProjectIdKey,
      ParserKey,
      parserLocalId,
    ];

    const storedParserConfig = {
      [SelfKey]: JSON.stringify(config),
    };

    await this.#client.set(this._buildNestedData(keys, storedParserConfig));
  }

  async setContextIdsForParser(
    parserGlobalId: string,
    contextsToBeAdded: DependantContext[],
    contextsToBeDeleted: DependantContext[]
  ): Promise<void> {
    const [parserOwnerId, parserKey, parserLocalId] =
      parserGlobalId.split(KeyDelimiter);

    if (parserKey !== ParserKey) {
      throw new Error("Invalid parser ID");
    }

    const addingKeys = contextsToBeAdded.map(hashObject);
    const deletingKeys = contextsToBeDeleted.map(hashObject);

    const savingData = {
      ...Object.fromEntries(addingKeys.map((k) => [k, ""])),
      ...Object.fromEntries(deletingKeys.map((k) => [k, null])),
    };

    // Key example:
    // bos.dapplets.near/settings/dapplets.near/parser/social-network/contexts
    const parentKeys = [
      parserOwnerId,
      SettingsKey,
      ProjectIdKey,
      ParserKey,
      parserLocalId,
      ParserContextsKey,
    ];

    await this.#client.set(this._buildNestedData(parentKeys, savingData));
  }

  // #endregion

  private _extractParserIdFromNamespace(namespace: string): {
    parserType: string;
    accountId: string;
    parserLocalId: string;
  } {
    if (!namespace.startsWith(DappletsNamespace)) {
      throw new Error("Invalid namespace");
    }

    const parserGlobalId = namespace.replace(DappletsNamespace, "");

    // Example: example.near/parser/social-network
    const [parserType, accountId, entityType, parserLocalId] =
      parserGlobalId.split(KeyDelimiter);

    if (entityType !== "parser" || !accountId || !parserLocalId) {
      throw new Error("Invalid namespace");
    }

    if (!SupportedParserTypes.includes(parserType)) {
      throw new Error(`Parser type "${parserType}" is not supported`);
    }

    return { parserType, accountId, parserLocalId };
  }

  private _buildNestedData(keys: string[], data: any): any {
    const [firstKey, ...anotherKeys] = keys;
    if (anotherKeys.length === 0) {
      return {
        [firstKey]: data,
      };
    } else {
      return {
        [firstKey]: this._buildNestedData(anotherKeys, data),
      };
    }
  }

  // Utils

  static _tryFillAppTargetWithContext(
    ifTarget: Record<string, any>,
    aliases: Record<string, string>,
    context: IContextNode
  ): Record<string, any> | null {
    const resolvedObject: Record<string, any> = {};

    for (const nsProp in ifTarget) {
      const value = ifTarget[nsProp];

      const { alias: propAlias, value: prop } = this._parseNsValue(nsProp);
      const { alias: exprAlias, value: expr } = this._parseNsValue(value);

      // ToDo: refactor
      if (propAlias) {
        if (context.namespaceURI !== aliases[propAlias]) {
          return null;
        }

        if (!context.parsedContext) {
          return null;
        }

        if (expr === "*") {
          // ToDo: replace with %ANY_SPECIFIC_ID%
          if (
            context.parsedContext[prop] === undefined ||
            context.parsedContext[prop] === null
          ) {
            return null;
          } else {
            resolvedObject[nsProp] = context.parsedContext[prop];
          }
        } else {
          if (context.parsedContext[prop] !== expr) {
            return null;
          } else {
            resolvedObject[nsProp] = value;
          }
        }
      } else {
        // default ns
        if (prop === "contextType") {
          if (exprAlias && aliases[exprAlias] !== context.namespaceURI) {
            return null;
          }

          if (expr !== context.tagName) {
            return null;
          }

          resolvedObject[nsProp] = value;
        } else {
          return null;
        }
      }
    }

    return resolvedObject;
  }

  static _parseNsValue(nsProp: string): {
    alias: string | null;
    value: string;
  } {
    const parts = nsProp.split(":");

    if (parts.length === 1) {
      return {
        alias: null,
        value: parts[0],
      };
    } else {
      return {
        alias: parts[0],
        value: parts[1],
      };
    }
  }
}
