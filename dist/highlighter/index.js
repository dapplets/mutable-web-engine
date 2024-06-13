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
exports.ContextReactangle = void 0;
const react_1 = __importStar(require("react"));
const DEFAULT_BORDER_RADIUS = 6; // px
const DEFAULT_BORDER_COLOR = '#384BFF'; //blue
const DEFAULT_BORDER_STYLE = 'dashed';
const DEFAULT_BORDER_WIDTH = 2; //px
const DEFAULT_BACKGROUND_COLOR = 'rgb(56 188 255 / 5%)'; // light blue
const defaultStyledBorder = `${DEFAULT_BORDER_WIDTH}px ${DEFAULT_BORDER_STYLE} ${DEFAULT_BORDER_COLOR}`;
const ContextReactangle = ({ context, styles, onClick, contextDepth, }) => {
    var _a, _b, _c;
    const [isEntered, setIsEntered] = (0, react_1.useState)(false);
    // const [isDisplayed, setIsDisplayed] = useState(false)
    const pickerRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (!pickerRef.current)
            return;
        const mouseEnterHandler = () => {
            setIsEntered(true);
            // setTimeout(() => setIsDisplayed(true))
        };
        const mouseLeaveHandler = () => {
            setIsEntered(false);
            // setTimeout(() => setIsDisplayed(false))
        };
        pickerRef.current.addEventListener('mouseenter', mouseEnterHandler);
        pickerRef.current.addEventListener('mouseleave', mouseLeaveHandler);
        return () => {
            if (!pickerRef.current)
                return;
            pickerRef.current.removeEventListener('mouseenter', mouseEnterHandler);
            pickerRef.current.removeEventListener('mouseleave', mouseLeaveHandler);
        };
    }, [pickerRef.current]);
    // if (!isEntered) return null
    if (!context.element)
        return null;
    const bodyOffset = document.documentElement.getBoundingClientRect();
    const targetOffset = context.element.getBoundingClientRect();
    const targetHeight = targetOffset.height;
    const targetWidth = targetOffset.width;
    const wrapperStyle = {
        left: targetOffset.left - bodyOffset.left,
        top: targetOffset.top - bodyOffset.top,
        width: targetWidth,
        height: targetHeight,
        backgroundColor: onClick ? (_a = styles === null || styles === void 0 ? void 0 : styles.backgroundColor) !== null && _a !== void 0 ? _a : DEFAULT_BACKGROUND_COLOR : 'transparent',
        borderRadius: (_b = styles === null || styles === void 0 ? void 0 : styles.borderRadius) !== null && _b !== void 0 ? _b : DEFAULT_BORDER_RADIUS,
        border: (_c = styles === null || styles === void 0 ? void 0 : styles.border) !== null && _c !== void 0 ? _c : defaultStyledBorder,
        position: 'absolute',
        zIndex: 99999999 + (contextDepth !== null && contextDepth !== void 0 ? contextDepth : 0),
        pointerEvents: onClick ? 'auto' : 'none',
        transition: 'all .2s ease-in-out',
        opacity: isEntered ? 1 : 0,
    };
    return react_1.default.createElement("div", { ref: pickerRef, style: wrapperStyle, className: "mweb-picker", onClick: onClick });
};
exports.ContextReactangle = ContextReactangle;
