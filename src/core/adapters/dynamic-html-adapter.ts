import { IParser, InsertionPoint } from '../parsers/interface'
import { InsertionPointWithElement } from '../tree/pure-tree/pure-context-node'
import { IContextNode, ITreeBuilder } from '../tree/types'
import { IAdapter, InsertionType } from './interface'

const DefaultInsertionType: InsertionType = InsertionType.Before

export class DynamicHtmlAdapter implements IAdapter {
  protected element: HTMLElement
  protected treeBuilder: ITreeBuilder
  protected parser: IParser
  public namespace: string
  public context: IContextNode

  #observerByElement: Map<HTMLElement, MutationObserver> = new Map()
  #elementByContext: WeakMap<IContextNode, HTMLElement> = new WeakMap()
  #contextByElement: Map<HTMLElement, IContextNode> = new Map()

  #isStarted = false // ToDo: find another way to check if adapter is started

  constructor(element: HTMLElement, treeBuilder: ITreeBuilder, namespace: string, parser: IParser) {
    this.element = element
    this.treeBuilder = treeBuilder
    this.namespace = namespace
    this.parser = parser
    this.context = this._createContextForElement(element, 'root')
  }

  start() {
    this.#observerByElement.forEach((observer, element) => {
      observer.observe(element, {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true,
      })

      // initial parsing without waiting for mutations in the DOM
      this._handleMutations(element, this.#contextByElement.get(element)!)
    })
    this.#isStarted = true
  }

  stop() {
    this.#isStarted = false
    this.#observerByElement.forEach((observer) => observer.disconnect())
  }

  injectElement(
    injectingElement: HTMLElement,
    context: IContextNode,
    insertionPoint: string | 'root'
  ) {
    const contextElement = this.#elementByContext.get(context)

    if (!contextElement) {
      throw new Error('Context element not found')
    }

    const insPoint = this.parser
      .getInsertionPoints(contextElement, context.contextType)
      .find((ip) => ip.name === insertionPoint)

    if (!insPoint) {
      throw new Error(`Insertion point "${insertionPoint}" is not defined in the parser`)
    }

    const insPointElement: HTMLElement | null = this.parser.findInsertionPoint(
      contextElement,
      context.contextType,
      insertionPoint
    )

    const insertionType = insPoint.insertionType ?? DefaultInsertionType

    if (!insPointElement) {
      throw new Error(
        `Insertion point "${insertionPoint}" not found in "${context.contextType}" context type for "${insertionType}" insertion type`
      )
    }

    switch (insertionType) {
      case InsertionType.Before:
        insPointElement.before(injectingElement)
        break
      case InsertionType.After:
        insPointElement.after(injectingElement)
        break
      case InsertionType.End:
        insPointElement.appendChild(injectingElement)
        break
      case InsertionType.Begin:
        insPointElement.insertBefore(injectingElement, insPointElement.firstChild)
        break
      default:
        throw new Error('Unknown insertion type')
    }
  }

  getInsertionPoints(context: IContextNode): InsertionPoint[] {
    const htmlElement = this.#elementByContext.get(context)!
    if (!htmlElement) return []
    return this.parser.getInsertionPoints(htmlElement, context.contextType)
  }

  getContextElement(context: IContextNode): HTMLElement | null {
    return this.#elementByContext.get(context) ?? null
  }

  getInsertionPointElement(context: IContextNode, insPointName: string): HTMLElement | null {
    const contextElement = this.getContextElement(context)
    if (!contextElement) return null
    return this.parser.findInsertionPoint(contextElement, context.contextType, insPointName)
  }

  _createContextForElement(element: HTMLElement, contextName: string): IContextNode {
    const parsedContext = this.parser.parseContext(element, contextName)
    const insPoints = this._findAvailableInsPoints(element, contextName)
    const context = this.treeBuilder.createNode(
      this.namespace,
      contextName,
      parsedContext,
      insPoints,
      element
    )

    const observer = new MutationObserver(() => this._handleMutations(element, context))

    this.#observerByElement.set(element, observer)
    this.#elementByContext.set(context, element)
    this.#contextByElement.set(element, context)

    // ToDo: duplicate code
    if (this.#isStarted) {
      observer.observe(element, {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true,
      })
    }

    return context
  }

  private _handleMutations(element: HTMLElement, context: IContextNode) {
    const parsedContext = this.parser.parseContext(element, context.contextType)
    const pairs = this.parser.findChildElements(element, context.contextType)
    const insPoints = this._findAvailableInsPoints(element, context.contextType)

    this.treeBuilder.updateParsedContext(context, parsedContext)
    this.treeBuilder.updateInsertionPoints(context, insPoints)
    this._appendNewChildContexts(pairs, context)
    this._removeOldChildContexts(pairs, context)
  }

  private _appendNewChildContexts(
    childPairs: { element: HTMLElement; contextName: string }[],
    parentContext: IContextNode
  ) {
    for (const { element, contextName } of childPairs) {
      if (!this.#contextByElement.has(element)) {
        const childContext = this._createContextForElement(element, contextName)
        this.#contextByElement.set(element, childContext)
        this.treeBuilder.appendChild(parentContext, childContext)

        // initial parsing
        this._handleMutations(element, childContext)
      }
    }
  }

  private _removeOldChildContexts(
    childPairs: { element: HTMLElement; contextName: string }[],
    parentContext: IContextNode
  ) {
    const childElementsSet = new Set(childPairs.map((pair) => pair.element))
    for (const [element, context] of this.#contextByElement) {
      if (!childElementsSet.has(element) && context.parentNode === parentContext) {
        this.treeBuilder.removeChild(parentContext, context)
        this.#contextByElement.delete(element)
        this.#observerByElement.get(element)?.disconnect()
        this.#observerByElement.delete(element)
      }
    }
  }

  // ToDo: move to parser?
  private _findAvailableInsPoints(
    element: HTMLElement,
    contextName: string
  ): InsertionPointWithElement[] {
    const parser = this.parser
    const definedInsPoints = parser.getInsertionPoints(element, contextName)

    const availableInsPoints = definedInsPoints
      .map((ip) => ({
        ...ip,
        element: parser.findInsertionPoint(element, contextName, ip.name),
      }))
      .filter((ip) => !!ip.element) as InsertionPointWithElement[]

    return availableInsPoints
  }
}
