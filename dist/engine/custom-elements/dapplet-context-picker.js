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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DappletContextPicker = void 0;
const React = __importStar(require("react"));
const engine_context_1 = require("../app/contexts/engine-context");
const transferable_context_1 = require("../app/common/transferable-context");
const _DappletContextPicker = ({ target, onClick, onMouseEnter, onMouseLeave, LatchComponent }) => {
    const { setPickerTask } = (0, engine_context_1.useEngine)();
    React.useEffect(() => {
        setPickerTask({
            target,
            onClick: (ctx) => onClick === null || onClick === void 0 ? void 0 : onClick((0, transferable_context_1.buildTransferableContext)(ctx)),
            onMouseEnter: (ctx) => onMouseEnter === null || onMouseEnter === void 0 ? void 0 : onMouseEnter((0, transferable_context_1.buildTransferableContext)(ctx)),
            onMouseLeave: (ctx) => onMouseLeave === null || onMouseLeave === void 0 ? void 0 : onMouseLeave((0, transferable_context_1.buildTransferableContext)(ctx)),
            LatchComponent: LatchComponent
                ? ({ context }) => React.createElement(LatchComponent, { context: (0, transferable_context_1.buildTransferableContext)(context) })
                : undefined,
        });
        return () => setPickerTask(null);
    }, [target, onClick, onMouseEnter, onMouseLeave]);
    return null;
};
const DappletContextPicker = (props) => {
    return React.createElement(_DappletContextPicker, Object.assign({}, props));
};
exports.DappletContextPicker = DappletContextPicker;
