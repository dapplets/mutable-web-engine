"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useContextApps = void 0;
const react_1 = require("react");
const use_engine_1 = require("./use-engine");
const useContextApps = (context) => {
    const { engine } = (0, use_engine_1.useEngine)();
    const apps = (0, react_1.useMemo)(() => engine.mutationManager.filterSuitableApps(context), [engine, context]);
    // ToDo: implement injectOnce
    // ToDo: update if new apps enabled
    return { apps };
};
exports.useContextApps = useContextApps;
