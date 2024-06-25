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
const mutable_web_context_1 = require("./contexts/mutable-web-context");
const viewport_context_1 = require("./contexts/viewport-context");
const context_picker_1 = require("./components/context-picker");
const context_manager_1 = require("./components/context-manager");
const App = ({ config, defaultMutationId, stylesMountPoint, children }) => {
    return (react_1.default.createElement(styled_components_1.StyleSheetManager, { target: stylesMountPoint },
        react_1.default.createElement(react_2.CoreProvider, null,
            react_1.default.createElement(engine_context_1.EngineProvider, null,
                react_1.default.createElement(mutable_web_context_1.MutableWebProvider, { config: config, defaultMutationId: defaultMutationId },
                    react_1.default.createElement(viewport_context_1.ViewportProvider, { stylesheetSrc: config.bosElementStyleSrc },
                        react_1.default.createElement(context_picker_1.ContextPicker, null),
                        react_1.default.createElement(context_manager_1.ContextManager, null)),
                    react_1.default.createElement(react_1.default.Fragment, null, children))))));
};
exports.App = App;
