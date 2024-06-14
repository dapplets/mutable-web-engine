"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const react_1 = __importDefault(require("react"));
const react_2 = require("../../react");
const styled_components_1 = require("styled-components");
const engine_context_1 = require("./contexts/engine-context");
const layout_1 = require("./layout");
const mutable_web_context_1 = require("./contexts/mutable-web-context");
const App = ({ config, defaultMutationId, stylesMountPoint, children }) => {
    return (react_1.default.createElement(styled_components_1.StyleSheetManager, { target: stylesMountPoint },
        react_1.default.createElement(react_2.CoreProvider, null,
            react_1.default.createElement(engine_context_1.EngineProvider, null,
                react_1.default.createElement(mutable_web_context_1.MutableWebProvider, { config: config, defaultMutationId: defaultMutationId },
                    react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement(layout_1.Layout, null),
                        children))))));
};
exports.App = App;
