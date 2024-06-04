"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Layout = void 0;
const context_picker_1 = require("./components/context-picker");
const context_manager_1 = require("./components/context-manager");
const react_1 = __importDefault(require("react"));
const Layout = ({ children }) => {
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(context_picker_1.ContextPicker, null),
        react_1.default.createElement(context_manager_1.ContextManager, null),
        children));
};
exports.Layout = Layout;
