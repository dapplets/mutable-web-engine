"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _LayoutManager_contextManager, _LayoutManager_layoutManager, _LayoutManager_userLinks, _LayoutManager_isEditMode;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutManager = void 0;
class LayoutManager {
    constructor(layoutManager, contextManager) {
        _LayoutManager_contextManager.set(this, void 0);
        _LayoutManager_layoutManager.set(this, void 0);
        _LayoutManager_userLinks.set(this, new Map());
        _LayoutManager_isEditMode.set(this, void 0);
        __classPrivateFieldSet(this, _LayoutManager_layoutManager, layoutManager, "f");
        __classPrivateFieldSet(this, _LayoutManager_contextManager, contextManager, "f");
        __classPrivateFieldSet(this, _LayoutManager_isEditMode, false, "f");
        this.forceUpdate();
    }
    addUserLink(userLink) {
        __classPrivateFieldGet(this, _LayoutManager_userLinks, "f").set(userLink.id, userLink);
        this.forceUpdate();
    }
    removeUserLink(userLinkId) {
        __classPrivateFieldGet(this, _LayoutManager_userLinks, "f").delete(userLinkId);
        this.forceUpdate();
    }
    enableEditMode() {
        __classPrivateFieldSet(this, _LayoutManager_isEditMode, true, "f");
        this.forceUpdate();
    }
    disableEditMode() {
        __classPrivateFieldSet(this, _LayoutManager_isEditMode, false, "f");
        this.forceUpdate();
    }
    forceUpdate() {
        const context = __classPrivateFieldGet(this, _LayoutManager_contextManager, "f").context;
        const links = Array.from(__classPrivateFieldGet(this, _LayoutManager_userLinks, "f").values());
        this._setProps({
            // ToDo: unify context forwarding
            context: context.parsedContext,
            contextType: context.tagName,
            widgets: links.map((link) => ({
                linkId: link.id,
                linkAuthorId: link.authorId,
                src: link.bosWidgetId,
                props: {
                    context: context.parsedContext,
                    link: {
                        id: link.id,
                        authorId: link.authorId,
                    },
                }, // ToDo: add props
            })),
            isEditMode: __classPrivateFieldGet(this, _LayoutManager_isEditMode, "f"),
            // ToDo: move functions to separate api namespace?
            createUserLink: this._createUserLink.bind(this),
            deleteUserLink: this._deleteUserLink.bind(this),
            enableEditMode: this._enableEditMode.bind(this),
            disableEditMode: this._disableEditMode.bind(this),
        });
    }
    _setProps(props) {
        __classPrivateFieldGet(this, _LayoutManager_layoutManager, "f").props = props;
    }
    // Widget API methods
    _createUserLink(bosWidgetId) {
        return __classPrivateFieldGet(this, _LayoutManager_contextManager, "f").createUserLink(bosWidgetId);
    }
    _deleteUserLink(userLinkId) {
        const userLink = __classPrivateFieldGet(this, _LayoutManager_userLinks, "f").get(userLinkId);
        if (!userLink) {
            throw new Error(`User link ${userLinkId} not found`);
        }
        return __classPrivateFieldGet(this, _LayoutManager_contextManager, "f").deleteUserLink(userLink);
    }
    _enableEditMode() {
        return __classPrivateFieldGet(this, _LayoutManager_contextManager, "f").enableEditMode();
    }
    _disableEditMode() {
        return __classPrivateFieldGet(this, _LayoutManager_contextManager, "f").disableEditMode();
    }
}
exports.LayoutManager = LayoutManager;
_LayoutManager_contextManager = new WeakMap(), _LayoutManager_layoutManager = new WeakMap(), _LayoutManager_userLinks = new WeakMap(), _LayoutManager_isEditMode = new WeakMap();