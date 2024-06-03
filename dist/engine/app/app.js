"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const react_1 = __importDefault(require("react"));
const react_2 = require("../../react");
const context_picker_1 = require("./components/context-picker");
const styled_components_1 = require("styled-components");
const App = ({ core, stylesMountPoint, }) => {
    return (react_1.default.createElement(styled_components_1.StyleSheetManager, { target: stylesMountPoint },
        react_1.default.createElement(react_2.MutableWebProvider, { core: core },
            react_1.default.createElement(context_picker_1.ContextPicker, null))));
};
exports.App = App;
