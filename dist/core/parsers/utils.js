"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChildContextElements = void 0;
const SHADOW_HOST = 'data-mweb-shadow-host';
function getChildContextElements(element, attribute, excludeAttribute) {
    const result = [];
    for (const child of element.children) {
        if (child instanceof HTMLElement) {
            if (excludeAttribute &&
                excludeAttribute.length &&
                excludeAttribute.some((attr) => child.hasAttribute(attr))) {
                continue;
            }
            else if (child.hasAttribute(attribute)) {
                result.push(child);
            }
            else if (child.hasAttribute(SHADOW_HOST) && child.shadowRoot) {
                result.push(...getChildContextElements(child.shadowRoot, attribute, excludeAttribute));
            }
            else {
                result.push(...getChildContextElements(child, attribute, excludeAttribute));
            }
        }
    }
    return result;
}
exports.getChildContextElements = getChildContextElements;
