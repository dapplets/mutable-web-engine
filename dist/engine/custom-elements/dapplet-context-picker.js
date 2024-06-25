"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DappletContextPicker = void 0;
const react_1 = __importDefault(require("react"));
const transferable_context_1 = require("../app/common/transferable-context");
const picker_context_1 = require("../app/contexts/picker-context");
const _DappletContextPicker = ({ target, onClick, onMouseEnter, onMouseLeave, LatchComponent, highlightChildren, children, }) => {
    const { setPickerTask } = (0, picker_context_1.usePicker)();
    react_1.default.useEffect(() => {
        setPickerTask({
            target,
            onClick: (ctx) => onClick === null || onClick === void 0 ? void 0 : onClick((0, transferable_context_1.buildTransferableContext)(ctx)),
            onMouseEnter: (ctx) => onMouseEnter === null || onMouseEnter === void 0 ? void 0 : onMouseEnter((0, transferable_context_1.buildTransferableContext)(ctx)),
            onMouseLeave: (ctx) => onMouseLeave === null || onMouseLeave === void 0 ? void 0 : onMouseLeave((0, transferable_context_1.buildTransferableContext)(ctx)),
            LatchComponent: LatchComponent
                ? ({ context, variant, contextDimensions }) => (react_1.default.createElement(LatchComponent, { context: (0, transferable_context_1.buildTransferableContext)(context), variant: variant, contextDimensions: contextDimensions }))
                : undefined,
            highlightChildren,
            children: Array.isArray(children)
                ? children
                    .map((c) => (typeof c === 'string' ? c.trim() : c))
                    .filter((c) => !!c)
                : children,
        });
        return () => setPickerTask(null);
    }, [target, onClick, onMouseEnter, onMouseLeave, LatchComponent, highlightChildren, children]);
    return null;
};
const DappletContextPicker = (props) => {
    return react_1.default.createElement(_DappletContextPicker, Object.assign({}, props));
};
exports.DappletContextPicker = DappletContextPicker;
