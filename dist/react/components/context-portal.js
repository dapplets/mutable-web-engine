"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextPortal = void 0;
const react_dom_1 = require("react-dom");
const ContextPortal = ({ context, children, injectTo }) => {
    var _a;
    // ToDo: replace insPoints.find with Map
    const targetElement = injectTo
        ? (_a = context.insPoints.find((ip) => ip.name === injectTo)) === null || _a === void 0 ? void 0 : _a.element
        : context.element;
    if (!targetElement)
        return null;
    return (0, react_dom_1.createPortal)(children, targetElement);
};
exports.ContextPortal = ContextPortal;
