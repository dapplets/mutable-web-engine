import { SocialDbClient } from "./social-db-client";

const ProjectIdKey = "dapplets.near";
const SettingsKey = "settings";
const RecursiveWildcardKey = "**";
const KeyDelimiter = "/";

export class SocialDbStorage {
  #client: SocialDbClient;

  constructor(_client: SocialDbClient) {
    this.#client = _client;
  }

  /**
   * @example
   * getById("bos.dapplets.near/parser/twitter")
   */
  async getById(id: string): Promise<any> {
    const keys = SocialDbStorage._buildKeysFromId(id);

    const queryResult = await this.#client.get([
      [...keys, RecursiveWildcardKey].join(KeyDelimiter),
    ]);

    return SocialDbStorage._getValueByKey(keys, queryResult);
  }

  /**
   * @example
   * setById("bos.dapplets.near/parser/twitter", { key: 'value' })
   */
  async setById(id: string, data: any): Promise<void> {
    const keys = SocialDbStorage._buildKeysFromId(id);
    await this.#client.set(SocialDbStorage._buildNestedData(keys, data));
  }

  /**
   * @example
   * deleteById("bos.dapplets.near/parser/twitter")
   */
  async deleteById(id: string): Promise<void> {
    const keys = SocialDbStorage._buildKeysFromId(id);
    await this.#client.delete(keys);
  }

  /**
   * @example
   * getKeys("%asterisk%/parser/%asterisk%")
   */
  async getKeys(query: string): Promise<string[]> {
    const queryKeys = SocialDbStorage._buildKeysFromId(query);
    const keys = await this.#client.keys([queryKeys.join(KeyDelimiter)]);
    return keys.map((key) => {
      const [accountId, , , type, localId, ...extraKeys] =
        key.split(KeyDelimiter);

      return [accountId, type, localId, ...extraKeys].join(KeyDelimiter);
    });
  }

  // Utils

  static _buildKeysFromId(globalId: string) {
    const [accountId, type, localId, ...extraKeys] =
      globalId.split(KeyDelimiter);
    return [accountId, SettingsKey, ProjectIdKey, type, localId, ...extraKeys];
  }

  static _getValueByKey(keys: string[], obj: any): any {
    const [firstKey, ...anotherKeys] = keys;
    if (anotherKeys.length === 0) {
      return obj[firstKey];
    } else {
      return this._getValueByKey(anotherKeys, obj[firstKey]);
    }
  }

  static _buildNestedData(keys: string[], data: any): any {
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
}
