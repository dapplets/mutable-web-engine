"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextPicker = void 0;
const react_1 = __importDefault(require("react"));
const react_2 = require("../../../react");
const engine_context_1 = require("../contexts/engine-context");
const mutation_manager_1 = require("../../mutation-manager");
const highlighter_1 = require("../../../highlighter");
const ContextTraverser = ({ node, children: ChildrenComponent, }) => {
    return (react_1.default.createElement(react_1.default.Fragment, null,
        node.element ? react_1.default.createElement(ChildrenComponent, { node: node }) : null,
        node.children.map((child, i) => (react_1.default.createElement(ContextTraverser, { key: i, node: child, children: ChildrenComponent })))));
};
const ContextPicker = () => {
    const { tree } = (0, react_2.useMutableWeb)();
    const { pickerTask } = (0, engine_context_1.useEngine)();
    if (!tree || !pickerTask)
        return null;
    return (react_1.default.createElement(ContextTraverser, { node: tree }, ({ node }) => {
        const isSuitable = pickerTask.target
            ? mutation_manager_1.MutationManager._isTargetMet(pickerTask.target, node)
            : true;
        if (!isSuitable)
            return null;
        return react_1.default.createElement(highlighter_1.ContextReactangle, { context: node, onClick: () => { var _a; return (_a = pickerTask.callback) === null || _a === void 0 ? void 0 : _a.call(pickerTask, node); } });
    }));
};
exports.ContextPicker = ContextPicker;
