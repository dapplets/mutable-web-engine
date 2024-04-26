import { getChildContextElements } from './utils'
import { IParser, InsertionPoint } from './interface'

const PROPS_ATTR = 'data-mweb-context-parsed'
const TYPE_ATTR = 'data-mweb-context-type'
const ID_ATTR = 'data-mweb-context-id'
const INS_ATTR = 'data-mweb-insertion-point'
const SHADOW_HOST = 'data-mweb-shadow-host'

export class MutableWebParser implements IParser {
  parseContext(element: Element) {
    const dataStr = element.getAttribute(PROPS_ATTR)
    return dataStr && JSON.parse(dataStr)
  }

  findChildElements(element: Element) {
    return getChildContextElements(element, TYPE_ATTR).map((element) => ({
      element,
      contextName: element.getAttribute(TYPE_ATTR)!,
    }))
  }

  findInsertionPoint(element: Element, _: string, insertionPoint: string): Element | null {
    const resEl = element.querySelector(`[${INS_ATTR}="${insertionPoint}"]`)
    if (resEl) return resEl
    if (element.hasAttribute(SHADOW_HOST) && element.shadowRoot)
      return (
        Array.from(element.shadowRoot.children)
          .map((child) => this.findInsertionPoint(child, '', insertionPoint))
          .find((el) => el) || null
      )
    const els = element.querySelectorAll(`[${SHADOW_HOST}]`)
    if (els && els.length)
      return (
        Array.from(els)
          .map((el) => this.findInsertionPoint(el, '', insertionPoint))
          .find((el) => el) || null
      )
    return null
  }

  getInsertionPoints(element: Element): InsertionPoint[] {
    return getChildContextElements(element, INS_ATTR, [TYPE_ATTR]).map((el) => ({
      name: el.getAttribute(INS_ATTR)!,
    }))
  }
}
