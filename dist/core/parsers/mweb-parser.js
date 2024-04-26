"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutableWebParser = void 0;
const utils_1 = require("./utils");
const PROPS_ATTR = 'data-mweb-context-parsed';
const TYPE_ATTR = 'data-mweb-context-type';
const INS_ATTR = 'data-mweb-insertion-point';
const SHADOW_HOST = 'data-mweb-shadow-host';
class MutableWebParser {
    parseContext(element) {
        const dataStr = element.getAttribute(PROPS_ATTR);
        return dataStr && JSON.parse(dataStr);
    }
    findChildElements(element) {
        return (0, utils_1.getChildContextElements)(element, TYPE_ATTR).map((element) => ({
            element,
            contextName: element.getAttribute(TYPE_ATTR),
        }));
    }
    findInsertionPoint(element, _, insertionPoint) {
        const resEl = element.querySelector(`[${INS_ATTR}="${insertionPoint}"]`);
        if (resEl)
            return resEl;
        if (element.hasAttribute(SHADOW_HOST) && element.shadowRoot)
            return (Array.from(element.shadowRoot.children)
                .map((child) => this.findInsertionPoint(child, '', insertionPoint))
                .find((el) => el) || null);
        const els = element.querySelectorAll(`[${SHADOW_HOST}]`);
        if (els && els.length)
            return (Array.from(els)
                .map((el) => this.findInsertionPoint(el, '', insertionPoint))
                .find((el) => el) || null);
        return null;
    }
    getInsertionPoints(element) {
        return (0, utils_1.getChildContextElements)(element, INS_ATTR, [TYPE_ATTR]).map((el) => ({
            name: el.getAttribute(INS_ATTR),
        }));
    }
}
exports.MutableWebParser = MutableWebParser;
