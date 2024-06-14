"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutableWebProvider = void 0;
const react_1 = __importStar(require("react"));
const mutable_web_context_1 = require("./mutable-web-context");
const engine_1 = require("../../../engine");
const use_mutation_apps_1 = require("./use-mutation-apps");
const use_mutation_parsers_1 = require("./use-mutation-parsers");
const react_2 = require("../../../../react");
const use_mutations_1 = require("./use-mutations");
const use_applications_1 = require("./use-applications");
const target_service_1 = require("../../services/target/target.service");
const parser_config_entity_1 = require("../../services/parser-config/parser-config.entity");
const MWebParserConfig = {
    parserType: parser_config_entity_1.AdapterType.MWeb,
    id: 'mweb',
    targets: [
        {
            namespace: 'engine',
            contextType: 'website',
            if: { id: { not: null } },
        },
    ],
};
const MutableWebProvider = ({ config, defaultMutationId, children }) => {
    const { tree, attachParserConfig, detachParserConfig, updateRootContext } = (0, react_2.useCore)();
    const engineRef = (0, react_1.useRef)(null);
    if (!engineRef.current) {
        engineRef.current = new engine_1.Engine(config);
        attachParserConfig(MWebParserConfig); // ToDo: move
    }
    const engine = engineRef.current;
    const { mutations, setMutations, isLoading: isMutationsLoading } = (0, use_mutations_1.useMutations)(engine);
    const { applications: allApps, isLoading: isAppsLoading } = (0, use_applications_1.useApplications)(engine);
    const [selectedMutationId, setSelectedMutationId] = (0, react_1.useState)(null);
    const [favoriteMutationId, setFavoriteMutationId] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        engine.mutationService.getFavoriteMutation().then((mutationId) => {
            setFavoriteMutationId(mutationId);
        });
    }, [engine]);
    const getMutationToBeLoaded = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        return ((_a = defaultMutationId !== null && defaultMutationId !== void 0 ? defaultMutationId : (yield engine.mutationService.getFavoriteMutation())) !== null && _a !== void 0 ? _a : (tree ? yield engine.mutationService.getLastUsedMutation(tree) : null));
    }), [defaultMutationId, engine, tree]);
    (0, react_1.useEffect)(() => {
        getMutationToBeLoaded().then((mutationId) => {
            setSelectedMutationId(mutationId);
        });
    }, [getMutationToBeLoaded]);
    const selectedMutation = (0, react_1.useMemo)(() => { var _a; return (_a = mutations.find((mut) => mut.id === selectedMutationId)) !== null && _a !== void 0 ? _a : null; }, [mutations, selectedMutationId]);
    const { mutationApps, setMutationApps, isLoading: isMutationAppsLoading, } = (0, use_mutation_apps_1.useMutationApps)(engine, selectedMutation);
    const activeApps = (0, react_1.useMemo)(() => mutationApps.filter((app) => app.settings.isEnabled), [mutationApps]);
    const { parserConfigs, isLoading: isMutationParsersLoading } = (0, use_mutation_parsers_1.useMutationParsers)(engine, mutationApps);
    (0, react_1.useEffect)(() => {
        if (!tree)
            return;
        updateRootContext({
            mutationId: selectedMutationId !== null && selectedMutationId !== void 0 ? selectedMutationId : null,
            gatewayId: config.gatewayId,
        });
        // Load parser configs for root context
        // ToDo: generalize for whole context tree
        for (const parser of parserConfigs) {
            const isSuitableParser = parser.targets.some((target) => target_service_1.TargetService.isTargetMet(target, tree));
            if (isSuitableParser) {
                attachParserConfig(parser);
            }
        }
        return () => {
            for (const parser of parserConfigs) {
                detachParserConfig(parser.id);
            }
        };
    }, [parserConfigs, tree, selectedMutationId]);
    // ToDo: move to separate hook
    const switchMutation = (0, react_1.useCallback)((mutationId) => __awaiter(void 0, void 0, void 0, function* () {
        if (selectedMutationId === mutationId)
            return;
        setSelectedMutationId(mutationId);
        if (mutationId) {
            yield engine.mutationService.updateMutationLastUsage(mutationId, window.location.hostname);
        }
    }), [selectedMutationId]);
    // ToDo: move to separate hook
    const setFavoriteMutation = (0, react_1.useCallback)((mutationId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            setFavoriteMutationId(mutationId);
            yield engine.mutationService.setFavoriteMutation(mutationId);
            setMutations((prev) => prev.map((mut) => mut.id === mutationId
                ? Object.assign(Object.assign({}, mut), { settings: Object.assign(Object.assign({}, mut.settings), { isFavorite: true }) }) : Object.assign(Object.assign({}, mut), { settings: Object.assign(Object.assign({}, mut.settings), { isFavorite: false }) })));
        }
        catch (err) {
            console.error(err);
        }
    }), [engine]);
    // ToDo: move to separate hook
    const removeMutationFromRecents = (0, react_1.useCallback)((mutationId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield engine.mutationService.removeMutationFromRecents(mutationId);
            setMutations((prev) => prev.map((mut) => mut.id === mutationId ? Object.assign(Object.assign({}, mut), { settings: Object.assign(Object.assign({}, mut.settings), { lastUsage: null }) }) : mut));
        }
        catch (err) {
            console.error(err);
        }
    }), [engine]);
    const isLoading = isMutationsLoading || isAppsLoading || isMutationAppsLoading || isMutationParsersLoading;
    const state = {
        engine,
        mutations,
        allApps,
        mutationApps,
        activeApps,
        selectedMutation,
        isLoading,
        switchMutation,
        setFavoriteMutation,
        removeMutationFromRecents,
        favoriteMutationId,
        setMutations,
        setMutationApps,
    };
    return react_1.default.createElement(mutable_web_context_1.MutableWebContext.Provider, { value: state }, children);
};
exports.MutableWebProvider = MutableWebProvider;
