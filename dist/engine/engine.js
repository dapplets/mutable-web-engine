"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Engine_provider, _Engine_bosWidgetFactory, _Engine_selector, _Engine_contextManagers, _Engine_nearConfig, _Engine_redirectMap, _Engine_devModePollingTimer, _Engine_repository, _Engine_viewport, _Engine_reactRoot, _Engine_refComponents;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Engine = exports.engineSingleton = void 0;
const core_1 = require("../core");
const bos_widget_factory_1 = require("./bos/bos-widget-factory");
const constants_1 = require("./constants");
const near_signer_1 = require("./providers/near-signer");
const social_db_provider_1 = require("./providers/social-db-provider");
const mutation_manager_1 = require("./mutation-manager");
const repository_1 = require("./storage/repository");
const json_storage_1 = require("./storage/json-storage");
const local_storage_1 = require("./storage/local-storage");
const viewport_1 = require("./viewport");
// ToDo: dirty hack
exports.engineSingleton = null;
class Engine {
    constructor(config) {
        var _a;
        this.config = config;
        _Engine_provider.set(this, void 0);
        _Engine_bosWidgetFactory.set(this, void 0);
        _Engine_selector.set(this, void 0);
        _Engine_contextManagers.set(this, new Map());
        _Engine_nearConfig.set(this, void 0);
        _Engine_redirectMap.set(this, null);
        _Engine_devModePollingTimer.set(this, null);
        _Engine_repository.set(this, void 0);
        _Engine_viewport.set(this, null);
        _Engine_reactRoot.set(this, null
        // ToDo: duplcated in ContextManager and LayoutManager
        );
        // ToDo: duplcated in ContextManager and LayoutManager
        _Engine_refComponents.set(this, new Map());
        this.started = false;
        this.getLastUsedMutation = () => __awaiter(this, void 0, void 0, function* () {
            const allMutations = yield this.getMutations();
            const hostname = window.location.hostname;
            const lastUsedData = yield Promise.all(allMutations.map((m) => __awaiter(this, void 0, void 0, function* () {
                return ({
                    id: m.id,
                    lastUsage: yield __classPrivateFieldGet(this, _Engine_repository, "f").getMutationLastUsage(m.id, hostname),
                });
            })));
            const usedMutationsData = lastUsedData
                .filter((m) => m.lastUsage)
                .map((m) => ({ id: m.id, lastUsage: new Date(m.lastUsage).getTime() }));
            if (usedMutationsData === null || usedMutationsData === void 0 ? void 0 : usedMutationsData.length) {
                if (usedMutationsData.length === 1)
                    return usedMutationsData[0].id;
                let lastMutation = usedMutationsData[0];
                for (let i = 1; i < usedMutationsData.length; i++) {
                    if (usedMutationsData[i].lastUsage > lastMutation.lastUsage) {
                        lastMutation = usedMutationsData[i];
                    }
                }
                return lastMutation.id;
            }
            else {
                // Activate default mutation for new users
                return __classPrivateFieldGet(this, _Engine_nearConfig, "f").defaultMutationId;
            }
        });
        if (!this.config.storage) {
            this.config.storage = new local_storage_1.LocalStorage('mutable-web-engine');
        }
        __classPrivateFieldSet(this, _Engine_bosWidgetFactory, new bos_widget_factory_1.BosWidgetFactory({
            tagName: (_a = this.config.bosElementName) !== null && _a !== void 0 ? _a : 'bos-component',
            bosElementStyleSrc: this.config.bosElementStyleSrc,
        }), "f");
        __classPrivateFieldSet(this, _Engine_selector, this.config.selector, "f");
        const nearConfig = (0, constants_1.getNearConfig)(this.config.networkId);
        const jsonStorage = new json_storage_1.JsonStorage(this.config.storage);
        __classPrivateFieldSet(this, _Engine_nearConfig, nearConfig, "f");
        __classPrivateFieldSet(this, _Engine_repository, new repository_1.Repository(jsonStorage), "f");
        const nearSigner = new near_signer_1.NearSigner(__classPrivateFieldGet(this, _Engine_selector, "f"), jsonStorage, nearConfig);
        __classPrivateFieldSet(this, _Engine_provider, new social_db_provider_1.SocialDbProvider(nearSigner, nearConfig.contractName), "f");
        this.mutationManager = new mutation_manager_1.MutationManager(__classPrivateFieldGet(this, _Engine_provider, "f"));
        this.core = new core_1.Core();
        this.core.on('contextStarted', this.handleContextStarted.bind(this));
        this.core.on('contextFinished', this.handleContextFinished.bind(this));
        this.core.on('contextChanged', this.handleContextChanged.bind(this));
        this.core.on('insertionPointStarted', this.handleInsPointStarted.bind(this));
        this.core.on('insertionPointFinished', this.handleInsPointFinished.bind(this));
        exports.engineSingleton = this;
    }
    handleContextStarted(_a) {
        return __awaiter(this, arguments, void 0, function* ({ context }) {
            // if (!this.started) return;
            if (!context.id)
                return;
            // We don't wait adapters here
            const parserConfigs = this.mutationManager.filterSuitableParsers(context);
            for (const config of parserConfigs) {
                this.core.attachParserConfig(config);
            }
            const adapter = this.core.adapters.get(context.namespace);
            if (!adapter)
                return;
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
        });
    }
    handleContextChanged({ context }) {
        var _a;
        if (!this.started)
            return;
        (_a = __classPrivateFieldGet(this, _Engine_contextManagers, "f").get(context)) === null || _a === void 0 ? void 0 : _a.forceUpdate();
    }
    handleContextFinished({ context }) {
        var _a;
        if (!this.started)
            return;
        (_a = __classPrivateFieldGet(this, _Engine_contextManagers, "f").get(context)) === null || _a === void 0 ? void 0 : _a.destroy();
        __classPrivateFieldGet(this, _Engine_contextManagers, "f").delete(context);
    }
    handleInsPointStarted({ context, insertionPoint, }) {
        var _a;
        (_a = __classPrivateFieldGet(this, _Engine_contextManagers, "f").get(context)) === null || _a === void 0 ? void 0 : _a.injectLayoutManager(insertionPoint.name);
    }
    handleInsPointFinished({ context, insertionPoint, }) {
        var _a;
        (_a = __classPrivateFieldGet(this, _Engine_contextManagers, "f").get(context)) === null || _a === void 0 ? void 0 : _a.destroyLayoutManager(insertionPoint.name);
    }
    start(mutationId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (mutationId === undefined) {
                mutationId = (yield this.getFavoriteMutation()) || (yield this.getLastUsedMutation());
            }
            if (mutationId !== null) {
                const mutations = yield this.getMutations();
                const mutation = (_a = mutations.find((mutation) => mutation.id === mutationId)) !== null && _a !== void 0 ? _a : null;
                if (mutation) {
                    // load mutation
                    yield this.mutationManager.switchMutation(mutation);
                    // load non-disabled apps only
                    yield Promise.all(mutation.apps.map((appId) => __awaiter(this, void 0, void 0, function* () {
                        const isAppEnabled = yield __classPrivateFieldGet(this, _Engine_repository, "f").getAppEnabledStatus(mutation.id, appId);
                        if (!isAppEnabled)
                            return;
                        return this.mutationManager.loadApp(appId);
                    })));
                    // save last usage
                    const currentDate = new Date().toISOString();
                    yield __classPrivateFieldGet(this, _Engine_repository, "f").setMutationLastUsage(mutation.id, currentDate, window.location.hostname);
                }
                else {
                    console.error('No suitable mutations found');
                }
            }
            this.started = true;
            this._attachViewport();
            this._updateRootContext();
            console.log('Mutable Web Engine started!', {
                engine: this,
                provider: __classPrivateFieldGet(this, _Engine_provider, "f"),
            });
        });
    }
    stop() {
        this.started = false;
        __classPrivateFieldGet(this, _Engine_contextManagers, "f").forEach((cm) => cm.destroy());
        this.core.clear();
        __classPrivateFieldGet(this, _Engine_contextManagers, "f").clear();
        this._detachViewport();
    }
    getMutations() {
        return __awaiter(this, void 0, void 0, function* () {
            // ToDo: use real context from the PureTreeBuilder
            const context = new core_1.PureContextNode('engine', 'website');
            context.parsedContext = { id: window.location.hostname };
            const mutations = yield this.mutationManager.getMutationsForContext(context);
            return Promise.all(mutations.map((mut) => this._populateMutationWithSettings(mut)));
        });
    }
    switchMutation(mutationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentMutation = yield this.getCurrentMutation();
            if ((currentMutation === null || currentMutation === void 0 ? void 0 : currentMutation.id) === mutationId)
                return;
            this.stop();
            yield this.start(mutationId);
        });
    }
    getCurrentMutation() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const mutation = (_a = this.mutationManager) === null || _a === void 0 ? void 0 : _a.mutation;
            if (!mutation)
                return null;
            return this._populateMutationWithSettings(mutation);
        });
    }
    enableDevMode(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options === null || options === void 0 ? void 0 : options.polling) {
                __classPrivateFieldSet(this, _Engine_devModePollingTimer, setInterval(() => this._tryFetchAndUpdateRedirects(true), 1500), "f");
            }
            else {
                __classPrivateFieldSet(this, _Engine_devModePollingTimer, null, "f");
                yield this._tryFetchAndUpdateRedirects(false);
            }
        });
    }
    disableDevMode() {
        if (__classPrivateFieldGet(this, _Engine_devModePollingTimer, "f") !== null) {
            clearInterval(__classPrivateFieldGet(this, _Engine_devModePollingTimer, "f"));
        }
        __classPrivateFieldSet(this, _Engine_redirectMap, null, "f");
        __classPrivateFieldGet(this, _Engine_contextManagers, "f").forEach((cm) => cm.setRedirectMap(null));
    }
    setFavoriteMutation(mutationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return __classPrivateFieldGet(this, _Engine_repository, "f").setFavoriteMutation(mutationId);
        });
    }
    getFavoriteMutation() {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield __classPrivateFieldGet(this, _Engine_repository, "f").getFavoriteMutation();
            return value !== null && value !== void 0 ? value : null;
        });
    }
    removeMutationFromRecents(mutationId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield __classPrivateFieldGet(this, _Engine_repository, "f").setMutationLastUsage(mutationId, null, window.location.hostname);
        });
    }
    getApplications() {
        return __awaiter(this, void 0, void 0, function* () {
            return __classPrivateFieldGet(this, _Engine_provider, "f").getApplications();
        });
    }
    createMutation(mutation) {
        return __awaiter(this, void 0, void 0, function* () {
            // ToDo: move to provider?
            if (yield __classPrivateFieldGet(this, _Engine_provider, "f").getMutation(mutation.id)) {
                throw new Error('Mutation with that ID already exists');
            }
            yield __classPrivateFieldGet(this, _Engine_provider, "f").saveMutation(mutation);
            return this._populateMutationWithSettings(mutation);
        });
    }
    editMutation(mutation) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            yield __classPrivateFieldGet(this, _Engine_provider, "f").saveMutation(mutation);
            // If the current mutation is edited, reload it
            if (mutation.id === ((_b = (_a = this.mutationManager) === null || _a === void 0 ? void 0 : _a.mutation) === null || _b === void 0 ? void 0 : _b.id)) {
                this.stop();
                yield this.start(mutation.id);
            }
            return this._populateMutationWithSettings(mutation);
        });
    }
    injectComponent(target, cmp) {
        // save refs for future contexts
        __classPrivateFieldGet(this, _Engine_refComponents, "f").set(cmp, target);
        __classPrivateFieldGet(this, _Engine_contextManagers, "f").forEach((contextManager, context) => {
            if (mutation_manager_1.MutationManager._isTargetMet(target, context)) {
                contextManager.injectComponent(target, cmp);
            }
        });
    }
    unjectComponent(target, cmp) {
        __classPrivateFieldGet(this, _Engine_refComponents, "f").delete(cmp);
        __classPrivateFieldGet(this, _Engine_contextManagers, "f").forEach((contextManager, context) => {
            if (mutation_manager_1.MutationManager._isTargetMet(target, context)) {
                contextManager.unjectComponent(target, cmp);
            }
        });
    }
    getAppsFromMutation(mutationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { mutation: currentMutation } = this.mutationManager;
            // don't fetch mutation if fetched already
            const mutation = (currentMutation === null || currentMutation === void 0 ? void 0 : currentMutation.id) === mutationId
                ? currentMutation
                : yield __classPrivateFieldGet(this, _Engine_provider, "f").getMutation(mutationId);
            if (!mutation) {
                throw new Error(`Mutation doesn't exist: ${mutationId}`);
            }
            // ToDo: improve readability
            return Promise.all(mutation.apps.map((appId) => __classPrivateFieldGet(this, _Engine_provider, "f")
                .getApplication(appId)
                .then((appMetadata) => (appMetadata ? this._populateAppWithSettings(appMetadata) : null)))).then((apps) => apps.filter((app) => app !== null));
        });
    }
    enableApp(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const currentMutationId = (_a = this.mutationManager.mutation) === null || _a === void 0 ? void 0 : _a.id;
            if (!currentMutationId) {
                throw new Error('Mutation is not active');
            }
            yield __classPrivateFieldGet(this, _Engine_repository, "f").setAppEnabledStatus(currentMutationId, appId, true);
            yield this._startApp(appId);
        });
    }
    disableApp(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const currentMutationId = (_a = this.mutationManager.mutation) === null || _a === void 0 ? void 0 : _a.id;
            if (!currentMutationId) {
                throw new Error('Mutation is not active');
            }
            yield __classPrivateFieldGet(this, _Engine_repository, "f").setAppEnabledStatus(currentMutationId, appId, false);
            yield this._stopApp(appId);
        });
    }
    _tryFetchAndUpdateRedirects(polling) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const res = yield fetch(constants_1.bosLoaderUrl, {
                    method: 'GET',
                    headers: { Accept: 'application/json' },
                });
                if (!res.ok) {
                    throw new Error('Network response was not OK');
                }
                const data = yield res.json();
                // This function is async
                if (polling && __classPrivateFieldGet(this, _Engine_devModePollingTimer, "f") === null) {
                    return;
                }
                __classPrivateFieldSet(this, _Engine_redirectMap, (_a = data === null || data === void 0 ? void 0 : data.components) !== null && _a !== void 0 ? _a : null, "f");
                __classPrivateFieldGet(this, _Engine_contextManagers, "f").forEach((cm) => cm.setRedirectMap(__classPrivateFieldGet(this, _Engine_redirectMap, "f")));
            }
            catch (err) {
                console.error(err);
                // this.disableDevMode()
            }
        });
    }
    _updateRootContext() {
        var _a, _b;
        // ToDo: instantiate root context with data initially
        // ToDo: looks like circular dependency
        this.core.updateRootContext({
            mutationId: (_b = (_a = this.mutationManager.mutation) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null,
            gatewayId: this.config.gatewayId,
        });
    }
    _populateMutationWithSettings(mutation) {
        return __awaiter(this, void 0, void 0, function* () {
            const isFavorite = (yield this.getFavoriteMutation()) === mutation.id;
            const lastUsage = yield __classPrivateFieldGet(this, _Engine_repository, "f").getMutationLastUsage(mutation.id, window.location.hostname);
            return Object.assign(Object.assign({}, mutation), { settings: {
                    isFavorite,
                    lastUsage,
                } });
        });
    }
    _populateAppWithSettings(app) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const currentMutationId = (_a = this.mutationManager.mutation) === null || _a === void 0 ? void 0 : _a.id;
            if (!currentMutationId)
                throw new Error('Mutation is not active');
            return Object.assign(Object.assign({}, app), { settings: {
                    isEnabled: yield __classPrivateFieldGet(this, _Engine_repository, "f").getAppEnabledStatus(currentMutationId, app.id),
                } });
        });
    }
    _attachViewport() {
        if (__classPrivateFieldGet(this, _Engine_viewport, "f")) {
            throw new Error('Already attached');
        }
        __classPrivateFieldSet(this, _Engine_viewport, new viewport_1.Viewport({ bosElementStyleSrc: this.config.bosElementStyleSrc }), "f");
        document.body.appendChild(__classPrivateFieldGet(this, _Engine_viewport, "f").outer);
    }
    _detachViewport() {
        if (__classPrivateFieldGet(this, _Engine_viewport, "f")) {
            document.body.removeChild(__classPrivateFieldGet(this, _Engine_viewport, "f").outer);
            __classPrivateFieldSet(this, _Engine_viewport, null, "f");
        }
    }
    _startApp(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mutationManager.loadApp(appId);
            yield this._traverseContextTree((context) => this._addAppsAndLinks(context, [appId]), this.core.tree);
        });
    }
    _stopApp(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._traverseContextTree((context) => this._removeAppsAndLinks(context, [appId]), this.core.tree);
            yield this.mutationManager.unloadApp(appId);
        });
    }
    _addAppsAndLinks(context, includedApps) {
        return __awaiter(this, void 0, void 0, function* () {
            const contextManager = __classPrivateFieldGet(this, _Engine_contextManagers, "f").get(context);
            if (!contextManager)
                return;
            const links = yield this.mutationManager.getLinksForContext(context, includedApps);
            const apps = this.mutationManager.filterSuitableApps(context, includedApps);
            links.forEach((link) => contextManager.addUserLink(link));
            apps.forEach((app) => contextManager.addAppMetadata(app));
        });
    }
    _removeAppsAndLinks(context, includedApps) {
        return __awaiter(this, void 0, void 0, function* () {
            const contextManager = __classPrivateFieldGet(this, _Engine_contextManagers, "f").get(context);
            if (!contextManager)
                return;
            const links = yield this.mutationManager.getLinksForContext(context, includedApps);
            links.forEach((link) => contextManager.removeUserLink(link));
            includedApps.forEach((appId) => contextManager.removeAppMetadata(appId));
        });
    }
    _traverseContextTree(callback, parent) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all([
                callback(parent),
                ...parent.children.map((child) => this._traverseContextTree(callback, child)),
            ]);
        });
    }
}
exports.Engine = Engine;
_Engine_provider = new WeakMap(), _Engine_bosWidgetFactory = new WeakMap(), _Engine_selector = new WeakMap(), _Engine_contextManagers = new WeakMap(), _Engine_nearConfig = new WeakMap(), _Engine_redirectMap = new WeakMap(), _Engine_devModePollingTimer = new WeakMap(), _Engine_repository = new WeakMap(), _Engine_viewport = new WeakMap(), _Engine_reactRoot = new WeakMap(), _Engine_refComponents = new WeakMap();
