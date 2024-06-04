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
exports.ContextManager = void 0;
const react_1 = __importStar(require("react"));
const react_2 = require("../../../react");
const engine_context_1 = require("../contexts/engine-context");
const use_user_links_1 = require("../contexts/engine-context/use-user-links");
const near_social_vm_1 = require("near-social-vm");
const use_portals_1 = require("../contexts/engine-context/use-portals");
const shadow_dom_wrapper_1 = require("../../bos/shadow-dom-wrapper");
const ContextManager = () => {
    const { tree } = (0, react_2.useMutableWeb)();
    if (!tree)
        return null;
    return react_1.default.createElement(ContextTraverser, { node: tree, component: ContextHandler });
};
exports.ContextManager = ContextManager;
const ContextTraverser = ({ node, component: Component }) => {
    return (react_1.default.createElement(react_1.default.Fragment, null,
        node.element ? react_1.default.createElement(Component, { context: node }) : null,
        node.children.map((child, i) => (react_1.default.createElement(ContextTraverser, { key: i, node: child, component: Component })))));
};
const ContextHandler = ({ context }) => {
    const { userLinks: allUserLinks } = (0, use_user_links_1.useUserLinks)(context);
    const transferableContext = (0, react_1.useMemo)(() => buildTransferableContext(context), [context]);
    return context.insPoints.map((ip) => {
        return (react_1.default.createElement(react_2.MWebPortal, { key: ip.name, context: context, injectTo: ip.name },
            react_1.default.createElement(InsPointHandler, { insPointName: ip.name, bosLayoutManager: ip.bosLayoutManager, context: context, transferableContext: transferableContext, allUserLinks: allUserLinks })));
    });
};
const InsPointHandler = ({ insPointName, bosLayoutManager, context, transferableContext, allUserLinks }) => {
    const { pickerCallback, setPickerCallback } = (0, engine_context_1.useEngine)();
    const { components } = (0, use_portals_1.usePortals)(context, insPointName);
    const pickContext = (0, react_1.useCallback)((target) => {
        return new Promise((resolve, reject) => {
            if (pickerCallback) {
                return reject('The picker is busy');
            }
            const callback = (context) => {
                resolve(context ? buildTransferableContext(context) : null);
                setPickerCallback(null);
            };
            setPickerCallback(callback);
        });
    }, []);
    const defaultLayoutManager = 'bos.dapplets.near/widget/DefaultLayoutManager';
    const props = {
        // ToDo: unify context forwarding
        context: transferableContext,
        // apps: apps.map((app) => ({
        //   id: app.id,
        //   metadata: app.metadata,
        // })),
        widgets: allUserLinks.map((link) => ({
            linkId: link.id,
            linkAuthorId: link.authorId,
            src: link.bosWidgetId,
            props: {
                context: transferableContext,
                link: {
                    id: link.id,
                    authorId: link.authorId,
                },
            }, // ToDo: add props
            isSuitable: link.insertionPoint === insPointName, // ToDo: LM know about widgets from other LM
        })),
        components: components,
        // isEditMode: this.#isEditMode,
        // ToDo: move functions to separate api namespace?
        // createUserLink: this._createUserLink.bind(this),
        // deleteUserLink: this._deleteUserLink.bind(this),
        // enableEditMode: this._enableEditMode.bind(this),
        // disableEditMode: this._disableEditMode.bind(this),
        // // For OverlayTrigger
        // attachContextRef: this._attachContextRef.bind(this),
        // attachInsPointRef: this._attachInsPointRef.bind(this),
        pickContext,
    };
    return (react_1.default.createElement(shadow_dom_wrapper_1.ShadowDomWrapper, null,
        react_1.default.createElement(near_social_vm_1.Widget, { src: bosLayoutManager !== null && bosLayoutManager !== void 0 ? bosLayoutManager : defaultLayoutManager, props: props, loading: react_1.default.createElement(react_1.default.Fragment, null) })));
};
const buildTransferableContext = (context) => ({
    namespace: context.namespace,
    type: context.contextType,
    id: context.id,
    parsed: context.parsedContext,
    parent: context.parentNode ? buildTransferableContext(context.parentNode) : null,
});
