"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutableWebContext = exports.contextDefaultValues = void 0;
const react_1 = require("react");
exports.contextDefaultValues = {
    engine: null, // ToDo
    mutations: [],
    allApps: [],
    mutationApps: [],
    isLoading: false,
    selectedMutation: null,
    favoriteMutationId: null,
    stopEngine: () => undefined,
    switchMutation: () => undefined,
    setFavoriteMutation: () => undefined,
    removeMutationFromRecents: () => undefined,
    setMutations: () => undefined,
    setMutationApps: () => undefined,
};
exports.MutableWebContext = (0, react_1.createContext)(exports.contextDefaultValues);
