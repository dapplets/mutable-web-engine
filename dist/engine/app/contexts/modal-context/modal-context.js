"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalContext = exports.contextDefaultValues = void 0;
const react_1 = require("react");
exports.contextDefaultValues = {
    notify: () => { },
};
exports.ModalContext = (0, react_1.createContext)(exports.contextDefaultValues);
