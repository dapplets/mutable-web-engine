const SHADOW_HOST = 'data-mweb-shadow-host'

export function getChildContextElements(
  element: Element | ShadowRoot,
  attribute: string,
  excludeAttribute?: string[]
) {
  const result: Element[] = []

  for (const child of element.children) {
    if (child instanceof HTMLElement) {
      if (
        excludeAttribute &&
        excludeAttribute.length &&
        excludeAttribute.some((attr) => child.hasAttribute(attr))
      ) {
        continue
      } else if (child.hasAttribute(attribute)) {
        result.push(child)
      } else if (child.hasAttribute(SHADOW_HOST) && child.shadowRoot) {
        result.push(...getChildContextElements(child.shadowRoot, attribute, excludeAttribute))
      } else {
        result.push(...getChildContextElements(child, attribute, excludeAttribute))
      }
    }
  }

  return result
}
