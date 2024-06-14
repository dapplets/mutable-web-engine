"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextPicker = void 0;
const react_1 = __importDefault(require("react"));
const react_2 = require("../../../react");
const engine_context_1 = require("../contexts/engine-context");
const highlighter_1 = require("../../../highlighter");
const target_service_1 = require("../services/target/target.service");
const ContextPicker = () => {
    const { tree } = (0, react_2.useCore)();
    const { pickerTask } = (0, engine_context_1.useEngine)();
    if (!tree || !pickerTask)
        return null;
    return (react_1.default.createElement(react_2.ContextTree, null, ({ context }) => {
        const isSuitable = pickerTask.target
            ? target_service_1.TargetService.isTargetMet(pickerTask.target, context)
            : true;
        if (!isSuitable)
            return null;
        return (react_1.default.createElement(highlighter_1.ContextReactangle, { context: context, onClick: () => { var _a; return (_a = pickerTask.callback) === null || _a === void 0 ? void 0 : _a.call(pickerTask, context); } }));
    }));
};
exports.ContextPicker = ContextPicker;
