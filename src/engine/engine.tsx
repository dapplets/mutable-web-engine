import { IContextNode, PureContextNode, Core } from '../core'
import { WalletSelector } from '@near-wallet-selector/core'
import { NearConfig, getNearConfig } from './constants'
import { NearSigner } from './app/services/near-signer/near-signer.service'
import { SocialDbService } from './app/services/social-db/social-db.service'
import { IStorage } from './app/services/local-db/local-storage'
import { LocalDbService } from './app/services/local-db/local-db.service'
import { LocalStorage } from './app/services/local-db/local-storage'
import { AppId, AppMetadata, AppWithSettings } from './app/services/application/application.entity'
import { Mutation, MutationId, MutationWithSettings } from './app/services/mutation/mutation.entity'
import { MutationRepository } from './app/services/mutation/mutation.repository'
import { ApplicationRepository } from './app/services/application/application.repository'
import { UserLinkRepository } from './app/services/user-link/user-link.repository'
import { ParserConfigRepository } from './app/services/parser-config/parser-config.repository'
import { MutationService } from './app/services/mutation/mutation.service'
import {
  AdapterType,
  ParserConfig,
  ParserConfigId,
} from './app/services/parser-config/parser-config.entity'
import { ApplicationService } from './app/services/application/application.service'
import { UserLinkSerivce } from './app/services/user-link/user-link.service'
import { BosUserLink } from './app/services/user-link/user-link.entity'
import { ParserConfigService } from './app/services/parser-config/parser-config.service'

const MWebParserConfig: ParserConfig = {
  parserType: AdapterType.MWeb,
  id: 'mweb',
  targets: [
    {
      namespace: 'engine',
      contextType: 'website',
      if: { id: { not: null } },
    },
  ],
}

export type EngineConfig = {
  networkId: string
  gatewayId: string
  selector: WalletSelector
  storage?: IStorage
  bosElementName?: string
  bosElementStyleSrc?: string
}

export class Engine {
  #selector: WalletSelector

  private mutationService: MutationService
  private applicationService: ApplicationService
  private userLinkService: UserLinkSerivce
  private parserConfigService: ParserConfigService

  started: boolean = false

  public mutation: Mutation | null = null
  activeApps = new Map<string, AppMetadata>()
  activeParsers = new Map<string, ParserConfig>()

  constructor(
    private core: Core,
    public readonly config: EngineConfig
  ) {
    if (!this.config.storage) {
      this.config.storage = new LocalStorage('mutable-web-engine')
    }

    this.#selector = this.config.selector
    const nearConfig = getNearConfig(this.config.networkId)
    const localDb = new LocalDbService(this.config.storage)
    const nearSigner = new NearSigner(this.#selector, localDb, nearConfig)
    const socialDb = new SocialDbService(nearSigner, nearConfig.contractName)
    const mutationRepository = new MutationRepository(socialDb, localDb)
    const applicationRepository = new ApplicationRepository(socialDb, localDb)
    const userLinkRepository = new UserLinkRepository(socialDb, nearSigner)
    const parserConfigRepository = new ParserConfigRepository(socialDb)
    this.mutationService = new MutationService(mutationRepository, nearConfig)
    this.applicationService = new ApplicationService(applicationRepository)
    this.userLinkService = new UserLinkSerivce(userLinkRepository, this.applicationService)
    this.parserConfigService = new ParserConfigService(parserConfigRepository)
  }

  getLastUsedMutation = async (): Promise<string | null> => {
    return this.mutationService.getLastUsedMutation(this.core.tree)
  }

  async start(mutationId?: string | null): Promise<void> {
    if (mutationId === undefined) {
      mutationId = (await this.getFavoriteMutation()) || (await this.getLastUsedMutation())
    }

    if (mutationId !== null) {
      const mutations = await this.getMutations()
      const mutation = mutations.find((mutation) => mutation.id === mutationId) ?? null

      if (mutation) {
        // load mutation
        await this._switchMutation(mutation)

        // load non-disabled apps only
        await Promise.all(
          mutation.apps.map(async (appId) => {
            const isAppEnabled = await this.applicationService.getAppEnabledStatus(
              mutation.id,
              appId
            )
            if (!isAppEnabled) return

            return this._loadApp(appId)
          })
        )

        await this.mutationService.updateMutationLastUsage(mutation.id, window.location.hostname)
      } else {
        console.error('No suitable mutations found')
      }
    }

    this.started = true

    // this._updateRootContext()

    console.log('Mutable Web Engine started!', {
      engine: this,
    })
  }

  stop() {
    this.started = false
  }

  async getMutations(): Promise<MutationWithSettings[]> {
    return this.mutationService.getMutationsWithSettings(this.core.tree)
  }

  async switchMutation(mutationId: string): Promise<void> {
    const currentMutation = await this.getCurrentMutation()
    if (currentMutation?.id === mutationId) return

    this.stop()
    await this.start(mutationId)
  }

  async getCurrentMutation(): Promise<MutationWithSettings | null> {
    const mutation = this.mutation
    if (!mutation) return null

    return this.mutationService.populateMutationWithSettings(mutation)
  }

  async setFavoriteMutation(mutationId: string | null): Promise<void> {
    return this.mutationService.setFavoriteMutation(mutationId)
  }

  async getFavoriteMutation(): Promise<string | null> {
    return this.mutationService.getFavoriteMutation()
  }

  async removeMutationFromRecents(mutationId: string): Promise<void> {
    return this.mutationService.removeMutationFromRecents(mutationId)
  }

  async createMutation(mutation: Mutation): Promise<MutationWithSettings> {
    return this.mutationService.createMutation(mutation)
  }

  async editMutation(mutation: Mutation): Promise<MutationWithSettings> {
    const editedMutation = await this.mutationService.editMutation(mutation)

    // If the current mutation is edited, reload it
    if (mutation.id === this.mutation?.id) {
      this.stop()
      await this.start(mutation.id)
    }

    return editedMutation
  }

  async getApplications(): Promise<AppMetadata[]> {
    return this.applicationService.getApplications()
  }

  async getAppsFromMutation(mutationId: string): Promise<AppWithSettings[]> {
    const { mutation: currentMutation } = this

    // don't fetch mutation if fetched already
    const mutation =
      currentMutation?.id === mutationId
        ? currentMutation
        : await this.mutationService.getMutation(mutationId)

    if (!mutation) {
      throw new Error(`Mutation doesn't exist: ${mutationId}`)
    }

    // ToDo: improve readability
    return Promise.all(
      mutation.apps.map((appId) =>
        this.applicationService
          .getApplication(appId)
          .then((appMetadata) =>
            appMetadata
              ? this.applicationService.populateAppWithSettings(mutation.id, appMetadata)
              : null
          )
      )
    ).then((apps) => apps.filter((app) => app !== null) as AppWithSettings[])
  }

  async enableApp(appId: string): Promise<void> {
    const currentMutationId = this.mutation?.id

    if (!currentMutationId) {
      throw new Error('Mutation is not active')
    }

    await this.applicationService.enableAppInMutation(currentMutationId, appId)

    await this._startApp(appId)
  }

  async disableApp(appId: string): Promise<void> {
    const currentMutationId = this.mutation?.id

    if (!currentMutationId) {
      throw new Error('Mutation is not active')
    }

    await this.applicationService.disableAppInMutation(currentMutationId, appId)

    await this._stopApp(appId)
  }

  private async _startApp(appId: string): Promise<void> {
    await this._loadApp(appId)
  }

  private async _stopApp(appId: string): Promise<void> {
    await this._unloadApp(appId)
  }

  private async _traverseContextTree(
    callback: (context: IContextNode) => Promise<void>,
    parent: IContextNode
  ): Promise<void> {
    await Promise.all([
      callback(parent),
      ...parent.children.map((child) => this._traverseContextTree(callback, child)),
    ])
  }

  // Methods from MutationManager

  async getLinksForContext(mutationId: MutationId, context: IContextNode): Promise<BosUserLink[]> {
    return this.userLinkService.getLinksForContext(
      Array.from(this.activeApps.values()),
      mutationId,
      context
    )
  }

  filterSuitableApps(context: IContextNode) {
    return this.applicationService.filterSuitableApps(Array.from(this.activeApps.values()), context)
  }

  private async _switchMutation(mutation: Mutation | null): Promise<void> {
    this.activeApps.clear()
    this.activeParsers.clear()
    this.mutation = null

    if (!mutation) return

    this.mutation = mutation

    // MWeb parser is enabled by default
    this.activeParsers.set(MWebParserConfig.id, MWebParserConfig)

    // ToDo: it loads all parsers, need to optimize
    await Promise.all(
      this.mutation.apps.map((appId) =>
        this.applicationService
          .getApplication(appId)
          .then((app) =>
            Promise.all((app?.targets ?? []).map((target) => this._loadParser(target.namespace)))
          )
      )
    )
  }

  public async _loadApp(appId: AppId): Promise<AppMetadata> {
    // prevents racing
    if (this.activeApps.has(appId)) {
      return this.activeApps.get(appId)!
    }

    const app = await this.applicationService.getApplication(appId)

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

  public async _unloadApp(appId: AppId): Promise<void> {
    this.activeApps.delete(appId)
    console.log(`App unloaded: ${appId}`)
  }

  public async _loadParser(parserId: ParserConfigId): Promise<ParserConfig> {
    // prevents racing
    if (this.activeParsers.has(parserId)) {
      return this.activeParsers.get(parserId)!
    }

    const parser = await this.parserConfigService.getParserConfig(parserId)

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

  public async _unloadParser(parserId: string): Promise<void> {
    this.activeParsers.delete(parserId)
    console.log(`Parser unloaded: ${parserId}`)
  }
}
