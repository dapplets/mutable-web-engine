"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePortals = void 0;
const react_1 = require("react");
const use_engine_1 = require("./use-engine");
const mutation_manager_1 = require("../../../mutation-manager");
const usePortals = (context, insPointName) => {
    const { portals } = (0, use_engine_1.useEngine)();
    const components = (0, react_1.useMemo)(() => {
        // ToDo: improve readability
        return Array.from(portals.entries())
            .filter(([, target]) => mutation_manager_1.MutationManager._isTargetMet(target, context) && target.injectTo === insPointName)
            .map(([component, target]) => ({
            target,
            component,
        }));
    }, [portals, context, insPointName]);
    return { components };
};
exports.usePortals = usePortals;
