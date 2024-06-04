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
exports.ContextPicker = void 0;
const react_1 = __importStar(require("react"));
const react_2 = require("../../../react");
const BORDER_RADIUS = 6; // px
const BORDER_COLOR = '#384BFF'; //blue
const BORDER_STYLE = 'dashed';
const BORDER_WIDTH = 2; //px
const BACKGROUND_COLOR = 'rgb(56 188 255 / 5%)'; // light blue
const styledBorder = `${BORDER_WIDTH}px ${BORDER_STYLE} ${BORDER_COLOR}`;
const ContextPicker = () => {
    const { tree } = (0, react_2.useMutableWeb)();
    if (!tree)
        return null;
    return react_1.default.createElement(ContextTraverser, { node: tree });
};
exports.ContextPicker = ContextPicker;
const ContextTraverser = ({ node }) => {
    return (react_1.default.createElement(react_1.default.Fragment, null,
        node.element ? react_1.default.createElement(ContextReactangle, { context: node, target: node.element }) : null,
        node.children.map((child, i) => (react_1.default.createElement(ContextTraverser, { key: i, node: child })))));
};
const ContextReactangle = ({ context, target, }) => {
    const [isEntered, setIsEntered] = (0, react_1.useState)(false);
    const [isDisplayed, setIsDisplayed] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const mouseEnterHandler = () => {
            setIsEntered(true);
            setTimeout(() => setIsDisplayed(true));
        };
        const mouseLeaveHandler = () => {
            setIsEntered(false);
            setTimeout(() => setIsDisplayed(false));
        };
        target.addEventListener('mouseenter', mouseEnterHandler);
        target.addEventListener('mouseleave', mouseLeaveHandler);
        return () => {
            target.removeEventListener('mouseenter', mouseEnterHandler);
            target.removeEventListener('mouseleave', mouseLeaveHandler);
        };
    }, [target]);
    if (!isEntered)
        return null;
    const bodyOffset = document.documentElement.getBoundingClientRect();
    const targetOffset = target.getBoundingClientRect();
    const targetHeight = targetOffset.height;
    const targetWidth = targetOffset.width;
    const wrapperStyle = {
        left: targetOffset.left - bodyOffset.left,
        top: targetOffset.top - bodyOffset.top,
        width: targetWidth,
        height: targetHeight,
        backgroundColor: BACKGROUND_COLOR,
        borderRadius: BORDER_RADIUS,
        border: styledBorder,
        position: 'absolute',
        zIndex: 99999999,
        pointerEvents: 'none',
        transition: 'all .2s ease-in-out',
        opacity: isDisplayed ? 1 : 0,
    };
    return react_1.default.createElement("div", { style: wrapperStyle, className: "mweb-picker" });
};
