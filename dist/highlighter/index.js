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
const server_1 = __importDefault(require("react-dom/server"));
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
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    const pickerRef = (0, react_1.useRef)(null);
    const bodyOffset = document.documentElement.getBoundingClientRect();
    const targetOffset = (_a = context.element) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
    const hasLatch = (0, react_1.useMemo)(() => LatchComponent && variant
        ? !!server_1.default.renderToStaticMarkup(react_1.default.createElement(LatchComponent, { context: context, variant: variant, contextDimensions: {
                width: (targetOffset === null || targetOffset === void 0 ? void 0 : targetOffset.width) || 0,
                height: (targetOffset === null || targetOffset === void 0 ? void 0 : targetOffset.height) || 0,
            } })).trim()
        : false, [context]);
    (0, react_1.useEffect)(() => {
        var _a, _b;
        if (hasLatch) {
            (_a = context.element) === null || _a === void 0 ? void 0 : _a.addEventListener('mouseenter', onMouseEnter);
            (_b = context.element) === null || _b === void 0 ? void 0 : _b.addEventListener('mouseleave', onMouseLeave);
        }
        if (!pickerRef.current)
            return;
        pickerRef.current.addEventListener('mouseenter', onMouseEnter);
        pickerRef.current.addEventListener('mouseleave', onMouseLeave);
        return () => {
            var _a, _b;
            if (hasLatch) {
                (_a = context.element) === null || _a === void 0 ? void 0 : _a.removeEventListener('mouseenter', onMouseEnter);
                (_b = context.element) === null || _b === void 0 ? void 0 : _b.removeEventListener('mouseleave', onMouseLeave);
            }
            if (!pickerRef.current)
                return;
            pickerRef.current.removeEventListener('mouseenter', onMouseEnter);
            pickerRef.current.removeEventListener('mouseleave', onMouseLeave);
        };
    }, [pickerRef.current]);
    if (!context.element || !targetOffset)
        return null;
    const isFirstLevelContext = !context.parentNode || context.parentNode.contextType === 'root';
    const contextDepth = getContextDepth(context);
    const backgroundColor = onClick
        ? (_b = styles === null || styles === void 0 ? void 0 : styles.backgroundColor) !== null && _b !== void 0 ? _b : DEFAULT_BACKGROUND_COLOR
        : 'transparent';
    const opacity = variant === 'primary' ||
        (variant === 'secondary' && highlightChildren) ||
        (!focusedContext && isFirstLevelContext)
        ? 1
        : 0;
    const border = (_c = styles === null || styles === void 0 ? void 0 : styles.border) !== null && _c !== void 0 ? _c : `${DEFAULT_BORDER_WIDTH}px ${isFirstLevelContext ? DEFAULT_BORDER_STYLE : DEFAULT_CHILDREN_BORDER_STYLE} ${variant === 'primary' ? DEFAULT_BORDER_COLOR : DEFAULT_INACTIVE_BORDER_COLOR}`;
    if (hasLatch) {
        const wrapperStyle = {
            transition: 'all .2s ease-in-out',
            opacity,
        };
        const topStyle = {
            left: targetOffset.left + 4 - bodyOffset.left,
            top: targetOffset.top - 1 - bodyOffset.top,
            width: targetOffset.width - ((_d = styles === null || styles === void 0 ? void 0 : styles.borderRadius) !== null && _d !== void 0 ? _d : DEFAULT_BORDER_RADIUS),
            height: 2,
            position: 'absolute',
            zIndex: 1000000 + (contextDepth !== null && contextDepth !== void 0 ? contextDepth : 0),
            borderTop: border,
        };
        const bottomStyle = {
            left: targetOffset.left + 4 - bodyOffset.left,
            top: targetOffset.top + targetOffset.height - 1 - bodyOffset.top,
            width: targetOffset.width - ((_e = styles === null || styles === void 0 ? void 0 : styles.borderRadius) !== null && _e !== void 0 ? _e : DEFAULT_BORDER_RADIUS),
            height: 2,
            position: 'absolute',
            zIndex: 1000000 + (contextDepth !== null && contextDepth !== void 0 ? contextDepth : 0),
            borderBottom: border,
        };
        const leftStyle = {
            left: targetOffset.left - 2 - bodyOffset.left,
            top: targetOffset.top - 1 - bodyOffset.top,
            height: targetOffset.height + 2,
            width: (_f = styles === null || styles === void 0 ? void 0 : styles.borderRadius) !== null && _f !== void 0 ? _f : DEFAULT_BORDER_RADIUS,
            position: 'absolute',
            zIndex: 1000000 + (contextDepth !== null && contextDepth !== void 0 ? contextDepth : 0),
            borderLeft: border,
            borderTop: border,
            borderBottom: border,
            borderRadius: `${(_g = styles === null || styles === void 0 ? void 0 : styles.borderRadius) !== null && _g !== void 0 ? _g : DEFAULT_BORDER_RADIUS}px 0 0 ${(_h = styles === null || styles === void 0 ? void 0 : styles.borderRadius) !== null && _h !== void 0 ? _h : DEFAULT_BORDER_RADIUS}px`,
        };
        const rightStyle = {
            left: targetOffset.left + targetOffset.width - 2 - bodyOffset.left,
            top: targetOffset.top - 1 - bodyOffset.top,
            height: targetOffset.height + 2,
            width: (_j = styles === null || styles === void 0 ? void 0 : styles.borderRadius) !== null && _j !== void 0 ? _j : DEFAULT_BORDER_RADIUS,
            position: 'absolute',
            zIndex: 1000000 + (contextDepth !== null && contextDepth !== void 0 ? contextDepth : 0),
            borderRight: border,
            borderTop: border,
            borderBottom: border,
            borderRadius: `0 ${(_k = styles === null || styles === void 0 ? void 0 : styles.borderRadius) !== null && _k !== void 0 ? _k : DEFAULT_BORDER_RADIUS}px ${(_l = styles === null || styles === void 0 ? void 0 : styles.borderRadius) !== null && _l !== void 0 ? _l : DEFAULT_BORDER_RADIUS}px 0`,
        };
        return (react_1.default.createElement("div", { style: wrapperStyle, className: "mweb-picker", ref: pickerRef },
            LatchComponent && variant && (react_1.default.createElement("div", { style: {
                    position: 'absolute',
                    left: targetOffset.left + 4 - bodyOffset.left,
                    top: targetOffset.top - 1 - bodyOffset.top,
                    zIndex: 1000001 + (contextDepth !== null && contextDepth !== void 0 ? contextDepth : 0),
                } },
                react_1.default.createElement(LatchComponent, { context: context, variant: variant, contextDimensions: {
                        width: targetOffset.width,
                        height: targetOffset.height,
                    } }))),
            react_1.default.createElement("div", { style: topStyle }),
            react_1.default.createElement("div", { style: leftStyle }),
            react_1.default.createElement("div", { style: rightStyle }),
            react_1.default.createElement("div", { style: bottomStyle })));
    }
    const wrapperStyle = {
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        top: targetOffset.top - bodyOffset.top,
        left: targetOffset.left - bodyOffset.left,
        width: targetOffset.width,
        height: targetOffset.height,
        borderRadius: (_m = styles === null || styles === void 0 ? void 0 : styles.borderRadius) !== null && _m !== void 0 ? _m : DEFAULT_BORDER_RADIUS,
        border,
        transition: 'all .2s ease-in-out',
        cursor: 'pointer',
        zIndex: 1000000 + (contextDepth !== null && contextDepth !== void 0 ? contextDepth : 0),
        opacity,
        backgroundColor,
    };
    return (react_1.default.createElement("div", { ref: pickerRef, style: wrapperStyle, className: "mweb-picker", onClick: onClick !== null && onClick !== void 0 ? onClick : undefined },
        react_1.default.createElement(lightning_1.default, { color: variant === 'primary' ? DEFAULT_BORDER_COLOR : DEFAULT_INACTIVE_BORDER_COLOR })));
};
exports.Highlighter = Highlighter;
