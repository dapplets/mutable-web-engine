"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextTree = void 0;
const react_1 = require("react");
const react_2 = __importDefault(require("react"));
const mutable_web_context_1 = require("../contexts/mutable-web-context");
const ContextTree = ({ children, }) => {
    const { tree } = (0, mutable_web_context_1.useMutableWeb)();
    if (!tree)
        return null;
    return react_2.default.createElement(TreeItem, { node: tree, component: children });
};
exports.ContextTree = ContextTree;
const TreeItem = ({ node, component: Component }) => {
    const [wrappedNode, setWrappedNode] = (0, react_1.useState)({ node });
    const [children, setChildren] = (0, react_1.useState)([...node.children]);
    (0, react_1.useEffect)(() => {
        const subscriptions = [
            node.on('childContextAdded', ({ child }) => {
                setChildren((prev) => [...prev, child]);
            }),
            node.on('childContextRemoved', ({ child }) => {
                setChildren((prev) => prev.filter((c) => c !== child));
            }),
            node.on('contextChanged', () => {
                setWrappedNode({ node });
            }),
        ];
        // ToDo: subscribe to new insertion points
        return () => {
            subscriptions.forEach((sub) => sub.remove());
        };
    }, [node]);
    return (react_2.default.createElement(react_2.default.Fragment, null,
        wrappedNode.node.element ? react_2.default.createElement(Component, { context: wrappedNode.node }) : null,
        children.map((child) => (react_2.default.createElement(TreeItem, { key: `${child.namespace}/${child.id}`, node: child, component: Component })))));
};
