import { IContextNode, PureContextNode, Core } from '../core'
import { BosWidgetFactory } from './bos/bos-widget-factory'
import {
  AppMetadata,
  AppWithSettings,
  IProvider,
  InjectableTarget,
  Mutation,
  MutationWithSettings,
} from './providers/provider'
import { WalletSelector } from '@near-wallet-selector/core'
import { NearConfig, bosLoaderUrl, getNearConfig } from './constants'
import { NearSigner } from './providers/near-signer'
import { SocialDbProvider } from './providers/social-db-provider'
import { ContextManager } from './context-manager'
import { MutationManager } from './mutation-manager'
import { IStorage } from './storage/storage'
import { Repository } from './storage/repository'
import { JsonStorage } from './storage/json-storage'
import { LocalStorage } from './storage/local-storage'
import { Viewport } from './viewport'
import { Root } from 'react-dom/client'
import React from 'react'
import { InsertionPointWithElement } from '../core/tree/pure-tree/pure-context-node'

export type EngineConfig = {
  networkId: string
  gatewayId: string
  selector: WalletSelector
  storage?: IStorage
  bosElementName?: string
  bosElementStyleSrc?: string
}

// ToDo: dirty hack
export let engineSingleton: Engine | null = null

export class Engine {
  #provider: IProvider
  #bosWidgetFactory: BosWidgetFactory
  #selector: WalletSelector
  #contextManagers: Map<IContextNode, ContextManager> = new Map()
  mutationManager: MutationManager
  #nearConfig: NearConfig
  #redirectMap: any = null
  #devModePollingTimer: number | null = null
  #repository: Repository
  #viewport: Viewport | null = null
  #reactRoot: Root | null = null

  // ToDo: duplcated in ContextManager and LayoutManager
  #refComponents = new Map<React.FC<unknown>, InjectableTarget>()

  started: boolean = false
  core: Core

  constructor(private config: EngineConfig) {
    if (!this.config.storage) {
      this.config.storage = new LocalStorage('mutable-web-engine')
    }

    this.#bosWidgetFactory = new BosWidgetFactory({
      tagName: this.config.bosElementName ?? 'bos-component',
      bosElementStyleSrc: this.config.bosElementStyleSrc,
    })
    this.#selector = this.config.selector
    const nearConfig = getNearConfig(this.config.networkId)
    const jsonStorage = new JsonStorage(this.config.storage)
    this.#nearConfig = nearConfig
    this.#repository = new Repository(jsonStorage)
    const nearSigner = new NearSigner(this.#selector, jsonStorage, nearConfig)
    this.#provider = new SocialDbProvider(nearSigner, nearConfig.contractName)
    this.mutationManager = new MutationManager(this.#provider)

    this.core = new Core()

    this.core.on('contextStarted', this.handleContextStarted.bind(this))
    this.core.on('contextFinished', this.handleContextFinished.bind(this))
    this.core.on('contextChanged', this.handleContextChanged.bind(this))
    this.core.on('insertionPointStarted', this.handleInsPointStarted.bind(this))
    this.core.on('insertionPointFinished', this.handleInsPointFinished.bind(this))

    engineSingleton = this
  }

  async handleContextStarted({ context }: { context: IContextNode }): Promise<void> {
    // if (!this.started) return;
    if (!context.id) return

    // We don't wait adapters here
    const parserConfigs = this.mutationManager.filterSuitableParsers(context)
    for (const config of parserConfigs) {
      this.core.attachParserConfig(config)
    }

    const adapter = this.core.adapters.get(context.namespace)

    if (!adapter) return

    // const contextManager = new ContextManager(
    //   context,
    //   adapter,
    //   this.#bosWidgetFactory,
    //   this.mutationManager,
    //   this.#nearConfig.defaultLayoutManager
    // )

    // this.#contextManagers.set(context, contextManager)

    // await this._addAppsAndLinks(context)

    // contextManager.setRedirectMap(this.#redirectMap)

    // Add existing React component refereneces from portals
    // this.#refComponents.forEach((target, cmp) => {
    //   if (MutationManager._isTargetMet(target, context)) {
    //     contextManager.injectComponent(target, cmp)
    //   }
    // })
  }

  handleContextChanged({ context }: { context: IContextNode }): void {
    if (!this.started) return

    this.#contextManagers.get(context)?.forceUpdate()
  }

  handleContextFinished({ context }: { context: IContextNode }): void {
    if (!this.started) return

    this.#contextManagers.get(context)?.destroy()
    this.#contextManagers.delete(context)
  }

  handleInsPointStarted({
    context,
    insertionPoint,
  }: {
    context: IContextNode
    insertionPoint: InsertionPointWithElement
  }): void {
    this.#contextManagers.get(context)?.injectLayoutManager(insertionPoint.name)
  }

  handleInsPointFinished({
    context,
    insertionPoint,
  }: {
    context: IContextNode
    insertionPoint: InsertionPointWithElement
  }): void {
    this.#contextManagers.get(context)?.destroyLayoutManager(insertionPoint.name)
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

    this._attachViewport()
    this._updateRootContext()

    console.log('Mutable Web Engine started!', {
      engine: this,
      provider: this.#provider,
    })
  }

  stop() {
    this.started = false
    this.#contextManagers.forEach((cm) => cm.destroy())
    this.core.clear()
    this.#contextManagers.clear()
    this._detachViewport()
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

  async enableDevMode(options?: { polling: boolean }) {
    if (options?.polling) {
      this.#devModePollingTimer = setInterval(
        () => this._tryFetchAndUpdateRedirects(true),
        1500
      ) as any as number
    } else {
      this.#devModePollingTimer = null
      await this._tryFetchAndUpdateRedirects(false)
    }
  }

  disableDevMode() {
    if (this.#devModePollingTimer !== null) {
      clearInterval(this.#devModePollingTimer)
    }

    this.#redirectMap = null
    this.#contextManagers.forEach((cm) => cm.setRedirectMap(null))
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
    return this.#provider.getApplications()
  }

  async createMutation(mutation: Mutation): Promise<MutationWithSettings> {
    // ToDo: move to provider?
    if (await this.#provider.getMutation(mutation.id)) {
      throw new Error('Mutation with that ID already exists')
    }

    await this.#provider.saveMutation(mutation)

    return this._populateMutationWithSettings(mutation)
  }

  async editMutation(mutation: Mutation): Promise<MutationWithSettings> {
    await this.#provider.saveMutation(mutation)

    // If the current mutation is edited, reload it
    if (mutation.id === this.mutationManager?.mutation?.id) {
      this.stop()
      await this.start(mutation.id)
    }

    return this._populateMutationWithSettings(mutation)
  }

  injectComponent<T>(target: InjectableTarget, cmp: React.FC<T>) {
    // save refs for future contexts
    this.#refComponents.set(cmp as React.FC<unknown>, target)

    this.#contextManagers.forEach((contextManager, context) => {
      if (MutationManager._isTargetMet(target, context)) {
        contextManager.injectComponent(target, cmp)
      }
    })
  }

  unjectComponent<T>(target: InjectableTarget, cmp: React.FC<T>) {
    this.#refComponents.delete(cmp as React.FC<unknown>)

    this.#contextManagers.forEach((contextManager, context) => {
      if (MutationManager._isTargetMet(target, context)) {
        contextManager.unjectComponent(target, cmp)
      }
    })
  }

  async getAppsFromMutation(mutationId: string): Promise<AppWithSettings[]> {
    const { mutation: currentMutation } = this.mutationManager

    // don't fetch mutation if fetched already
    const mutation =
      currentMutation?.id === mutationId
        ? currentMutation
        : await this.#provider.getMutation(mutationId)

    if (!mutation) {
      throw new Error(`Mutation doesn't exist: ${mutationId}`)
    }

    // ToDo: improve readability
    return Promise.all(
      mutation.apps.map((appId) =>
        this.#provider
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

  private async _tryFetchAndUpdateRedirects(polling: boolean) {
    try {
      const res = await fetch(bosLoaderUrl, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      })

      if (!res.ok) {
        throw new Error('Network response was not OK')
      }

      const data = await res.json()

      // This function is async
      if (polling && this.#devModePollingTimer === null) {
        return
      }

      this.#redirectMap = data?.components ?? null
      this.#contextManagers.forEach((cm) => cm.setRedirectMap(this.#redirectMap))
    } catch (err) {
      console.error(err)
      // this.disableDevMode()
    }
  }

  private _updateRootContext() {
    // ToDo: instantiate root context with data initially
    // ToDo: looks like circular dependency
    this.core.updateRootContext({
      mutationId: this.mutationManager.mutation?.id ?? null,
      gatewayId: this.config.gatewayId,
    })
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

  private _attachViewport() {
    if (this.#viewport) {
      throw new Error('Already attached')
    }

    this.#viewport = new Viewport({ bosElementStyleSrc: this.config.bosElementStyleSrc })
    document.body.appendChild(this.#viewport.outer)
  }

  private _detachViewport() {
    if (this.#viewport) {
      document.body.removeChild(this.#viewport.outer)
      this.#viewport = null
    }
  }

  private async _startApp(appId: string): Promise<void> {
    await this.mutationManager.loadApp(appId)

    await this._traverseContextTree(
      (context) => this._addAppsAndLinks(context, [appId]),
      this.core.tree
    )
  }

  private async _stopApp(appId: string): Promise<void> {
    await this._traverseContextTree(
      (context) => this._removeAppsAndLinks(context, [appId]),
      this.core.tree
    )

    await this.mutationManager.unloadApp(appId)
  }

  private async _addAppsAndLinks(context: IContextNode, includedApps?: string[]) {
    const contextManager = this.#contextManagers.get(context)

    if (!contextManager) return

    const links = await this.mutationManager.getLinksForContext(context, includedApps)
    const apps = this.mutationManager.filterSuitableApps(context, includedApps)

    links.forEach((link) => contextManager.addUserLink(link))
    apps.forEach((app) => contextManager.addAppMetadata(app))
  }

  private async _removeAppsAndLinks(context: IContextNode, includedApps: string[]) {
    const contextManager = this.#contextManagers.get(context)

    if (!contextManager) return

    const links = await this.mutationManager.getLinksForContext(context, includedApps)

    links.forEach((link) => contextManager.removeUserLink(link))
    includedApps.forEach((appId) => contextManager.removeAppMetadata(appId))
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
