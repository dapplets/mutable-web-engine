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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Highlighter = void 0;
const react_1 = __importStar(require("react"));
const lightning_1 = __importDefault(require("./assets/icons/lightning"));
const DEFAULT_BORDER_RADIUS = 6; // px
const DEFAULT_BORDER_COLOR = '#384BFF'; // blue
const DEFAULT_INACTIVE_BORDER_COLOR = '#384BFF4D'; // light blue
const DEFAULT_BORDER_STYLE = 'solid';
const DEFAULT_CHILDREN_BORDER_STYLE = 'dashed';
const DEFAULT_BORDER_WIDTH = 2; //px
const DEFAULT_BACKGROUND_COLOR = 'rgb(56 188 255 / 5%)'; // light light blue
const getElementDepth = (el) => {
    let depth = 0;
    let host = el.host;
    while (el.parentNode !== null || host) {
        if (host)
            el = host;
        el = el.parentNode;
        host = el.host;
        depth++;
    }
    return depth;
};
const getContextDepth = (context) => {
    return context.element ? getElementDepth(context.element) : 0;
};
const Highlighter = ({ focusedContext, context, onMouseEnter, onMouseLeave, styles, onClick, highlightChildren, variant, LatchComponent, }) => {
    var _a, _b, _c;
    const pickerRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (!pickerRef.current)
            return;
        pickerRef.current.addEventListener('mouseenter', onMouseEnter);
        pickerRef.current.addEventListener('mouseleave', onMouseLeave);
        return () => {
            if (!pickerRef.current)
                return;
            pickerRef.current.removeEventListener('mouseenter', onMouseEnter);
            pickerRef.current.removeEventListener('mouseleave', onMouseLeave);
        };
    }, [pickerRef.current]);
    if (!context.element)
        return null;
    const isFirstLevelContext = !context.parentNode || context.parentNode.contextType === 'root';
    const bodyOffset = document.documentElement.getBoundingClientRect();
    const targetOffset = context.element.getBoundingClientRect();
    const contextDepth = getContextDepth(context);
    const backgroundColor = onClick && variant !== 'latch-only'
        ? (_a = styles === null || styles === void 0 ? void 0 : styles.backgroundColor) !== null && _a !== void 0 ? _a : DEFAULT_BACKGROUND_COLOR
        : 'transparent';
    const opacity = variant === 'primary' ||
        (variant === 'secondary' && highlightChildren) ||
        (!focusedContext && isFirstLevelContext) ||
        variant === 'latch-only'
        ? 1
        : 0;
    const border = (_b = styles === null || styles === void 0 ? void 0 : styles.border) !== null && _b !== void 0 ? _b : (variant !== 'latch-only'
        ? `${DEFAULT_BORDER_WIDTH}px ${isFirstLevelContext ? DEFAULT_BORDER_STYLE : DEFAULT_CHILDREN_BORDER_STYLE} ${variant === 'primary' ? DEFAULT_BORDER_COLOR : DEFAULT_INACTIVE_BORDER_COLOR}`
        : undefined);
    const wrapperStyle = {
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        top: targetOffset.top - bodyOffset.top,
        left: targetOffset.left - bodyOffset.left,
        width: targetOffset.width,
        height: targetOffset.height,
        borderRadius: (_c = styles === null || styles === void 0 ? void 0 : styles.borderRadius) !== null && _c !== void 0 ? _c : DEFAULT_BORDER_RADIUS,
        border,
        backgroundColor,
        transition: 'all .2s ease-in-out',
        cursor: 'pointer',
        pointerEvents: onClick ? 'auto' : 'none',
        zIndex: 1000000 + (contextDepth !== null && contextDepth !== void 0 ? contextDepth : 0),
        opacity,
    };
    return (react_1.default.createElement("div", { ref: pickerRef, style: wrapperStyle, className: "mweb-picker", onClick: onClick !== null && onClick !== void 0 ? onClick : undefined },
        onClick && variant !== 'latch-only' && (react_1.default.createElement(lightning_1.default, { color: variant === 'primary' ? DEFAULT_BORDER_COLOR : DEFAULT_INACTIVE_BORDER_COLOR })),
        LatchComponent ? react_1.default.createElement(LatchComponent, { context: context }) : null));
};
exports.Highlighter = Highlighter;
