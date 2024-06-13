import { IContextNode, PureContextNode, Core } from '../core'
import { AppWithSettings, MutationWithSettings } from './providers/provider'
import { WalletSelector } from '@near-wallet-selector/core'
import { NearConfig, getNearConfig } from './constants'
import { NearSigner } from './app/services/near-signer/near-signer.service'
import { SocialDbService } from './app/services/social-db/social-db.service'
import { MutationManager } from './mutation-manager'
import { IStorage } from './app/services/local-db/local-storage'
import { Repository } from './storage/repository'
import { LocalDbService } from './app/services/local-db/local-db.service'
import { LocalStorage } from './app/services/local-db/local-storage'
import { AppMetadata } from './app/services/application/application.entity'
import { Mutation } from './app/services/mutation/mutation.entity'
import { MutationRepository } from './app/services/mutation/mutation.repository'
import { ApplicationRepository } from './app/services/application/application.repository'
import { UserLinkRepository } from './app/services/user-link/user-link.repository'
import { ParserConfigRepository } from './app/services/parser-config/parser-config.repository'

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
  mutationManager: MutationManager
  #nearConfig: NearConfig
  #repository: Repository

  private mutationRepository: MutationRepository
  private applicationRepository: ApplicationRepository
  private userLinkRepository: UserLinkRepository
  private parserConfigRepository: ParserConfigRepository

  started: boolean = false

  constructor(public readonly config: EngineConfig) {
    if (!this.config.storage) {
      this.config.storage = new LocalStorage('mutable-web-engine')
    }

    this.#selector = this.config.selector
    const nearConfig = getNearConfig(this.config.networkId)
    const jsonStorage = new LocalDbService(this.config.storage)
    this.#nearConfig = nearConfig
    this.#repository = new Repository(jsonStorage)
    const nearSigner = new NearSigner(this.#selector, jsonStorage, nearConfig)
    const socialDb = new SocialDbService(nearSigner, nearConfig.contractName)
    this.mutationRepository = new MutationRepository(socialDb)
    this.applicationRepository = new ApplicationRepository(socialDb)
    this.userLinkRepository = new UserLinkRepository(socialDb, nearSigner)
    this.parserConfigRepository = new ParserConfigRepository(socialDb)
    this.mutationManager = new MutationManager(
      this.mutationRepository,
      this.applicationRepository,
      this.userLinkRepository,
      this.parserConfigRepository
    )
  }

  getLastUsedMutation = async (): Promise<string | null> => {
    const allMutations = await this.getMutations()
    const hostname = window.location.hostname
    const lastUsedData = await Promise.all(
      allMutations.map(async (m) => ({
        id: m.id,
        lastUsage: await this.#repository.getMutationLastUsage(m.id, hostname),
      }))
    )
    const usedMutationsData = lastUsedData
      .filter((m) => m.lastUsage)
      .map((m) => ({ id: m.id, lastUsage: new Date(m.lastUsage!).getTime() }))

    if (usedMutationsData?.length) {
      if (usedMutationsData.length === 1) return usedMutationsData[0].id
      let lastMutation = usedMutationsData[0]
      for (let i = 1; i < usedMutationsData.length; i++) {
        if (usedMutationsData[i].lastUsage > lastMutation.lastUsage) {
          lastMutation = usedMutationsData[i]
        }
      }
      return lastMutation.id
    } else {
      // Activate default mutation for new users
      return this.#nearConfig.defaultMutationId
    }
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
        await this.mutationManager.switchMutation(mutation)

        // load non-disabled apps only
        await Promise.all(
          mutation.apps.map(async (appId) => {
            const isAppEnabled = await this.#repository.getAppEnabledStatus(mutation.id, appId)
            if (!isAppEnabled) return

            return this.mutationManager.loadApp(appId)
          })
        )

        // save last usage
        const currentDate = new Date().toISOString()
        await this.#repository.setMutationLastUsage(
          mutation.id,
          currentDate,
          window.location.hostname
        )
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
    // ToDo: use real context from the PureTreeBuilder
    const context = new PureContextNode('engine', 'website')
    context.parsedContext = { id: window.location.hostname }

    const mutations = await this.mutationManager.getMutationsForContext(context)

    return Promise.all(mutations.map((mut) => this._populateMutationWithSettings(mut)))
  }

  async switchMutation(mutationId: string): Promise<void> {
    const currentMutation = await this.getCurrentMutation()
    if (currentMutation?.id === mutationId) return

    this.stop()
    await this.start(mutationId)
  }

  async getCurrentMutation(): Promise<MutationWithSettings | null> {
    const mutation = this.mutationManager?.mutation
    if (!mutation) return null

    return this._populateMutationWithSettings(mutation)
  }

  async setFavoriteMutation(mutationId: string | null): Promise<void> {
    return this.#repository.setFavoriteMutation(mutationId)
  }

  async getFavoriteMutation(): Promise<string | null> {
    const value = await this.#repository.getFavoriteMutation()
    return value ?? null
  }

  async removeMutationFromRecents(mutationId: string): Promise<void> {
    await this.#repository.setMutationLastUsage(mutationId, null, window.location.hostname)
  }

  async getApplications(): Promise<AppMetadata[]> {
    return this.applicationRepository.getApplications()
  }

  async createMutation(mutation: Mutation): Promise<MutationWithSettings> {
    // ToDo: move to provider?
    if (await this.mutationRepository.getMutation(mutation.id)) {
      throw new Error('Mutation with that ID already exists')
    }

    await this.mutationRepository.saveMutation(mutation)

    return this._populateMutationWithSettings(mutation)
  }

  async editMutation(mutation: Mutation): Promise<MutationWithSettings> {
    await this.mutationRepository.saveMutation(mutation)

    // If the current mutation is edited, reload it
    if (mutation.id === this.mutationManager?.mutation?.id) {
      this.stop()
      await this.start(mutation.id)
    }

    return this._populateMutationWithSettings(mutation)
  }

  async getAppsFromMutation(mutationId: string): Promise<AppWithSettings[]> {
    const { mutation: currentMutation } = this.mutationManager

    // don't fetch mutation if fetched already
    const mutation =
      currentMutation?.id === mutationId
        ? currentMutation
        : await this.mutationRepository.getMutation(mutationId)

    if (!mutation) {
      throw new Error(`Mutation doesn't exist: ${mutationId}`)
    }

    // ToDo: improve readability
    return Promise.all(
      mutation.apps.map((appId) =>
        this.applicationRepository
          .getApplication(appId)
          .then((appMetadata) => (appMetadata ? this._populateAppWithSettings(appMetadata) : null))
      )
    ).then((apps) => apps.filter((app) => app !== null) as AppWithSettings[])
  }

  async enableApp(appId: string): Promise<void> {
    const currentMutationId = this.mutationManager.mutation?.id

    if (!currentMutationId) {
      throw new Error('Mutation is not active')
    }

    await this.#repository.setAppEnabledStatus(currentMutationId, appId, true)

    await this._startApp(appId)
  }

  async disableApp(appId: string): Promise<void> {
    const currentMutationId = this.mutationManager.mutation?.id

    if (!currentMutationId) {
      throw new Error('Mutation is not active')
    }

    await this.#repository.setAppEnabledStatus(currentMutationId, appId, false)

    await this._stopApp(appId)
  }

  private async _populateMutationWithSettings(mutation: Mutation): Promise<MutationWithSettings> {
    const isFavorite = (await this.getFavoriteMutation()) === mutation.id
    const lastUsage = await this.#repository.getMutationLastUsage(
      mutation.id,
      window.location.hostname
    )

    return {
      ...mutation,
      settings: {
        isFavorite,
        lastUsage,
      },
    }
  }

  private async _populateAppWithSettings(app: AppMetadata): Promise<AppWithSettings> {
    const currentMutationId = this.mutationManager.mutation?.id

    if (!currentMutationId) throw new Error('Mutation is not active')

    return {
      ...app,
      settings: {
        isEnabled: await this.#repository.getAppEnabledStatus(currentMutationId, app.id),
      },
    }
  }

  private async _startApp(appId: string): Promise<void> {
    await this.mutationManager.loadApp(appId)
  }

  private async _stopApp(appId: string): Promise<void> {
    await this.mutationManager.unloadApp(appId)
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
}
