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
const engine_context_1 = require("../engine-context");
const MutableWebProvider = ({ children }) => {
    const { engine } = (0, engine_context_1.useEngine)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [selectedMutationId, setSelectedMutationId] = (0, react_1.useState)(null);
    const [mutations, setMutations] = (0, react_1.useState)([]);
    const [allApps, setAllApps] = (0, react_1.useState)([]);
    const [mutationApps, setMutationApps] = (0, react_1.useState)([]);
    const [favoriteMutationId, setFavoriteMutationId] = (0, react_1.useState)(null);
    const loadMutations = (engine) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const [mutations, allApps, selectedMutation, favoriteMutationId] = yield Promise.all([
            engine.getMutations(),
            engine.getApplications(),
            engine.getCurrentMutation(),
            engine.getFavoriteMutation(),
        ]);
        setMutations(mutations);
        setAllApps(allApps);
        setSelectedMutationId((_a = selectedMutation === null || selectedMutation === void 0 ? void 0 : selectedMutation.id) !== null && _a !== void 0 ? _a : null);
        setFavoriteMutationId(favoriteMutationId);
    });
    const loadMutationApps = (engine, selectedMutationId) => __awaiter(void 0, void 0, void 0, function* () {
        if (selectedMutationId) {
            setMutationApps(yield engine.getAppsFromMutation(selectedMutationId));
        }
        else {
            setMutationApps([]);
        }
    });
    const selectedMutation = (0, react_1.useMemo)(() => { var _a; return (_a = mutations.find((mut) => mut.id === selectedMutationId)) !== null && _a !== void 0 ? _a : null; }, [mutations, selectedMutationId]);
    (0, react_1.useEffect)(() => {
        loadMutations(engine);
    }, [engine]);
    (0, react_1.useEffect)(() => {
        loadMutationApps(engine, selectedMutationId);
    }, [engine, selectedMutationId]);
    const stopEngine = () => {
        setSelectedMutationId(null);
        engine.stop();
    };
    // ToDo: move to separate hook
    const switchMutation = (mutationId) => __awaiter(void 0, void 0, void 0, function* () {
        setSelectedMutationId(mutationId);
        try {
            setIsLoading(true);
            if (engine.started) {
                yield engine.switchMutation(mutationId);
            }
            else {
                yield engine.start(mutationId);
            }
        }
        catch (err) {
            console.error(err);
            // ToDo: save previous mutation and switch back if failed
        }
        finally {
            setMutations(yield engine.getMutations());
            setIsLoading(false);
        }
    });
    // ToDo: move to separate hook
    const setFavoriteMutation = (mutationId) => __awaiter(void 0, void 0, void 0, function* () {
        const previousFavoriteMutationId = favoriteMutationId;
        try {
            setFavoriteMutationId(mutationId);
            yield engine.setFavoriteMutation(mutationId);
        }
        catch (err) {
            console.error(err);
            setFavoriteMutationId(previousFavoriteMutationId);
        }
    });
    // ToDo: move to separate hook
    const removeMutationFromRecents = (mutationId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield engine.removeMutationFromRecents(mutationId);
            setMutations(yield engine.getMutations());
        }
        catch (err) {
            console.error(err);
        }
    });
    const state = {
        engine,
        mutations,
        allApps,
        mutationApps,
        selectedMutation,
        isLoading,
        favoriteMutationId,
        stopEngine,
        switchMutation,
        setFavoriteMutation,
        removeMutationFromRecents,
        setMutations,
        setMutationApps,
    };
    return react_1.default.createElement(mutable_web_context_1.MutableWebContext.Provider, { value: state }, children);
};
exports.MutableWebProvider = MutableWebProvider;
