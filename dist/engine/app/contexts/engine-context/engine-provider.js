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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EngineProvider = void 0;
const react_1 = __importStar(require("react"));
const engine_context_1 = require("./engine-context");
const dev_server_service_1 = require("../../services/dev-server-service");
const json_stringify_deterministic_1 = __importDefault(require("json-stringify-deterministic"));
const DevModeUpdateInterval = 1500;
const EngineProvider = ({ engine, children }) => {
    const viewportRef = react_1.default.useRef(null);
    const [portals, setPortals] = (0, react_1.useState)(new Map());
    const [pickerTask, setPickerTask] = (0, react_1.useState)(null);
    const [redirectMap, setRedirectMap] = (0, react_1.useState)(null);
    const [isDevMode, setIsDevMode] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (!isDevMode) {
            setRedirectMap(null);
            return;
        }
        let isMount = true;
        const timer = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
            const newRedirectMap = yield (0, dev_server_service_1.getRedirectMap)();
            if (!isMount)
                return;
            // prevents rerendering
            setRedirectMap((prev) => (0, json_stringify_deterministic_1.default)(prev) !== (0, json_stringify_deterministic_1.default)(newRedirectMap) ? newRedirectMap : prev);
        }), DevModeUpdateInterval);
        return () => {
            isMount = false;
            clearInterval(timer);
        };
    }, [isDevMode]);
    const enableDevMode = (0, react_1.useCallback)(() => {
        setIsDevMode(true);
    }, []);
    const disableDevMode = (0, react_1.useCallback)(() => {
        setIsDevMode(false);
    }, []);
    const addPortal = (0, react_1.useCallback)((key, target, component) => {
        setPortals((prev) => new Map(prev.set(key, { component: component, target })));
    }, []);
    const removePortal = (0, react_1.useCallback)((key) => {
        setPortals((prev) => {
            prev.delete(key);
            return new Map(prev);
        });
    }, []);
    const state = {
        engine,
        viewportRef,
        portals,
        addPortal,
        removePortal,
        pickerTask,
        setPickerTask,
        redirectMap,
        enableDevMode,
        disableDevMode,
    };
    (0, react_1.useEffect)(() => {
        console.log('engine context', state);
    }, []);
    return react_1.default.createElement(engine_context_1.EngineContext.Provider, { value: state }, children);
};
exports.EngineProvider = EngineProvider;
