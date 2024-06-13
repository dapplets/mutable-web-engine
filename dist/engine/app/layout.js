"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Layout = void 0;
const react_1 = __importDefault(require("react"));
const context_picker_1 = require("./components/context-picker");
const context_manager_1 = require("./components/context-manager");
const shadow_dom_wrapper_1 = require("../bos/shadow-dom-wrapper");
const engine_context_1 = require("./contexts/engine-context");
const Layout = () => {
    const { viewportRef } = (0, engine_context_1.useEngine)();
    return (react_1.default.createElement(shadow_dom_wrapper_1.ShadowDomWrapper, { ref: viewportRef },
        react_1.default.createElement(context_picker_1.ContextPicker, null),
        react_1.default.createElement(context_manager_1.ContextManager, null)));
};
exports.Layout = Layout;
