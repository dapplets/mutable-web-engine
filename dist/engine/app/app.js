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
exports.App = void 0;
const react_1 = __importStar(require("react"));
const react_2 = require("../../react");
const styled_components_1 = require("styled-components");
const engine_1 = require("../engine");
const engine_context_1 = require("./contexts/engine-context");
const layout_1 = require("./layout");
const App = ({ config, defaultMutationId, stylesMountPoint, children }) => {
    const [engine, setEngine] = (0, react_1.useState)(null);
    // ToDo: move to EngineProvider
    (0, react_1.useEffect)(() => {
        if (!config)
            return;
        (() => __awaiter(void 0, void 0, void 0, function* () {
            const engine = new engine_1.Engine(config);
            console.log('Mutable Web Engine is initializing...');
            if (defaultMutationId) {
                try {
                    yield engine.start(defaultMutationId);
                }
                catch (err) {
                    console.error(err);
                    yield engine.start();
                }
            }
            else {
                yield engine.start();
            }
            setEngine(engine);
        }))();
    }, [config, defaultMutationId]);
    if (!engine)
        return null;
    return (react_1.default.createElement(styled_components_1.StyleSheetManager, { target: stylesMountPoint },
        react_1.default.createElement(react_2.CoreProvider, { core: engine.core },
            react_1.default.createElement(engine_context_1.EngineProvider, { engine: engine },
                react_1.default.createElement(layout_1.Layout, null, children)))));
};
exports.App = App;
