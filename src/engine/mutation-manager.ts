import { IContextNode } from '../core'
import {
  AppId,
  AppMetadata,
  AppMetadataTarget,
} from './app/services/application/application.entity'
import { ApplicationRepository } from './app/services/application/application.repository'
import { MutationId } from './app/services/mutation/mutation.entity'
import { MutationRepository } from './app/services/mutation/mutation.repository'
import { ParserConfig, ParserConfigId } from './app/services/parser-config/parser-config.entity'
import { ParserConfigRepository } from './app/services/parser-config/parser-config.repository'
import { ScalarType, TargetCondition } from './app/services/target/target.entity'
import { LinkIndexObject, UserLinkId } from './app/services/user-link/user-link.entity'
import { UserLinkRepository } from './app/services/user-link/user-link.repository'
import { BosUserLink } from './providers/provider'

export type AppWithTargetLinks = AppMetadata & {
  targets: { links: BosUserLink[] }[]
}

export class MutationManager {
  activeApps = new Map<string, AppMetadata>()
  activeParsers = new Map<string, ParserConfig>()

  constructor(
    private applicationRepository: ApplicationRepository,
    private userLinkRepository: UserLinkRepository,
    private parserConfigRepository: ParserConfigRepository
  ) {}

  // #region Read methods

  async getAppsAndLinksForContext(
    mutationId: MutationId,
    context: IContextNode
  ): Promise<AppWithTargetLinks[]> {
    const promises: Promise<AppWithTargetLinks>[] = []

    for (const app of this.activeApps.values()) {
      const suitableTargets = app.targets.filter((target) =>
        MutationManager._isTargetMet(target, context)
      )

      if (suitableTargets.length > 0) {
        // ToDo: batch requests
        const targetPromises = suitableTargets.map((target) =>
          this._getUserLinksForTarget(mutationId, app.id, target, context).then((links) => ({
            ...target,
            links,
          }))
        )

        const appPromise = Promise.all(targetPromises).then((targets) => ({
          ...app,
          targets,
        }))

        promises.push(appPromise)
      }
    }

    const appLinksNested = await Promise.all(promises)

    return appLinksNested
  }

  // ToDo: replace with getAppsAndLinksForContext
  filterSuitableApps(context: IContextNode, includedApps?: AppId[]): AppMetadata[] {
    const suitableApps: AppMetadata[] = []

    const appsToCheck = includedApps
      ? Array.from(this.activeApps.values()).filter((app) => includedApps.includes(app.id))
      : Array.from(this.activeApps.values())

    for (const app of appsToCheck) {
      const suitableTargets = app.targets.filter((target) =>
        MutationManager._isTargetMet(target, context)
      )

      if (suitableTargets.length > 0) {
        suitableApps.push({ ...app, targets: suitableTargets })
      }
    }

    return suitableApps
  }

  // ToDo: replace with getAppsAndLinksForContext
  async getLinksForContext(
    mutationId: MutationId,
    context: IContextNode,
    includedApps?: AppId[]
  ): Promise<BosUserLink[]> {
    const promises: Promise<BosUserLink[]>[] = []

    const appsToCheck = includedApps
      ? Array.from(this.activeApps.values()).filter((app) => includedApps.includes(app.id))
      : Array.from(this.activeApps.values())

    for (const app of appsToCheck) {
      const suitableTargets = app.targets.filter((target) =>
        MutationManager._isTargetMet(target, context)
      )

      // ToDo: batch requests
      suitableTargets.forEach((target) => {
        promises.push(this._getUserLinksForTarget(mutationId, app.id, target, context))
      })
    }

    const appLinksNested = await Promise.all(promises)

    return appLinksNested.flat(2)
  }

  filterSuitableParsers(context: IContextNode): ParserConfig[] {
    const suitableParsers: ParserConfig[] = []

    for (const parser of this.activeParsers.values()) {
      const suitableTargets = parser.targets.filter((target) =>
        MutationManager._isTargetMet(target, context)
      )

      if (suitableTargets.length > 0) {
        suitableParsers.push({ ...parser, targets: suitableTargets })
      }
    }

    return suitableParsers
  }

  // #endregion

  // #region Write methods

  async createLink(
    mutationId: MutationId,
    appGlobalId: AppId,
    context: IContextNode
  ): Promise<BosUserLink> {
    const app = this.activeApps.get(appGlobalId)

    if (!app) {
      throw new Error('App is not active')
    }

    const suitableTargets = app.targets.filter((target) =>
      MutationManager._isTargetMet(target, context)
    )

    if (suitableTargets.length === 0) {
      throw new Error('No suitable targets found')
    }

    if (suitableTargets.length > 1) {
      throw new Error('More than one suitable targets found')
    }

    const [target] = suitableTargets

    const indexObject = MutationManager._buildLinkIndex(app.id, mutationId, target, context)

    // ToDo: this limitation on the frontend side only
    if (target.injectOnce) {
      const existingLinks = await this.userLinkRepository.getLinksByIndex(indexObject)
      if (existingLinks.length > 0) {
        throw new Error(
          `The widget is injected already. The "injectOnce" parameter limits multiple insertion of widgets`
        )
      }
    }

    const indexedLink = await this.userLinkRepository.createLink(indexObject)

    return {
      id: indexedLink.id,
      appId: appGlobalId,
      namespace: target.namespace,
      authorId: indexedLink.authorId,
      bosWidgetId: target.componentId,
      insertionPoint: target.injectTo,
    }
  }

  async deleteUserLink(userLinkId: UserLinkId): Promise<void> {
    return this.userLinkRepository.deleteUserLink(userLinkId)
  }

  public async loadApp(appId: AppId): Promise<AppMetadata> {
    // prevents racing
    if (this.activeApps.has(appId)) {
      return this.activeApps.get(appId)!
    }

    const app = await this.applicationRepository.getApplication(appId)

    if (!app) {
      throw new Error(`App doesn't exist: ${appId}`)
    }

    // prevents racing
    if (this.activeApps.has(appId)) {
      return this.activeApps.get(appId)!
    }

    this.activeApps.set(app.id, app)
    console.log(`App loaded: ${appId}`)

    return app
  }

  public async unloadApp(appId: AppId): Promise<void> {
    this.activeApps.delete(appId)
    console.log(`App unloaded: ${appId}`)
  }

  public async loadParser(parserId: ParserConfigId): Promise<ParserConfig> {
    // prevents racing
    if (this.activeParsers.has(parserId)) {
      return this.activeParsers.get(parserId)!
    }

    const parser = await this.parserConfigRepository.getParserConfig(parserId)

    if (!parser) {
      throw new Error(`Parser doesn't exist: ${parserId}`)
    }

    // prevents racing
    if (this.activeParsers.has(parserId)) {
      return this.activeParsers.get(parserId)!
    }

    this.activeParsers.set(parser.id, parser)

    return parser
  }

  public async unloadParser(parserId: string): Promise<void> {
    this.activeParsers.delete(parserId)
    console.log(`Parser unloaded: ${parserId}`)
  }

  // #endregion

  // #region Private

  private async _getUserLinksForTarget(
    mutationId: string,
    appId: string,
    target: AppMetadataTarget,
    context: IContextNode
  ): Promise<BosUserLink[]> {
    const indexObject = MutationManager._buildLinkIndex(appId, mutationId, target, context)
    const indexedLinks = await this.userLinkRepository.getLinksByIndex(indexObject)

    return indexedLinks.map((link) => ({
      id: link.id,
      appId: appId,
      authorId: link.authorId,
      namespace: target.namespace,
      bosWidgetId: target.componentId, // ToDo: unify
      insertionPoint: target.injectTo, // ToDo: unify
    }))
  }

  // #endregion

  // #region Utils

  static _buildLinkIndex(
    appId: AppId,
    mutationId: MutationId,
    target: AppMetadataTarget,
    context: IContextNode
  ): LinkIndexObject {
    const indexedContextData = this._buildIndexedContextValues(target.if, context.parsedContext)

    return {
      appId,
      mutationId,
      namespace: target.namespace,
      contextType: target.contextType,
      if: indexedContextData,
    }
  }

  static _buildIndexedContextValues(
    conditions: Record<string, TargetCondition>,
    values: Record<string, ScalarType>
  ): Record<string, ScalarType> {
    const object: Record<string, ScalarType> = {}

    for (const property in conditions) {
      if (conditions[property].index) {
        object[property] = values[property]
      }
    }

    return object
  }

  static _isTargetMet(
    target: Pick<AppMetadataTarget, 'namespace' | 'contextType' | 'if'>,
    context: Pick<IContextNode, 'namespace' | 'contextType' | 'parsedContext'>
  ): boolean {
    // ToDo: check insertion points?
    return (
      target.namespace === context.namespace &&
      target.contextType === context.contextType &&
      this._areConditionsMet(target.if, context.parsedContext)
    )
  }

  static _areConditionsMet(
    conditions: Record<string, TargetCondition>,
    values: Record<string, ScalarType>
  ): boolean {
    for (const property in conditions) {
      if (!this._isConditionMet(conditions[property], values[property])) {
        return false
      }
    }

    return true
  }

  static _isConditionMet(condition: TargetCondition, value: ScalarType): boolean {
    const { not: _not, eq: _eq, contains: _contains, in: _in, endsWith: _endsWith } = condition

    if (_not !== undefined) {
      return _not !== value
    }

    if (_eq !== undefined) {
      return _eq === value
    }

    if (_contains !== undefined && typeof value === 'string') {
      return value.includes(_contains)
    }

    if (_endsWith !== undefined && typeof value === 'string') {
      return value.endsWith(_endsWith)
    }

    if (_in !== undefined) {
      return _in.includes(value)
    }

    return false
  }

  // #endregion
}
