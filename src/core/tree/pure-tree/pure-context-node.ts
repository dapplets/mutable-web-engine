import { EventEmitter, Subscription } from '../../event-emitter'
import { IContextNode, InsertionPointWithElement, TreeNodeEvents } from '../types'

export class PureContextNode implements IContextNode {
  public id: string | null = null
  public contextType: string
  public namespace: string
  public parentNode: IContextNode | null = null
  public children: IContextNode[] = []
  public insPoints: InsertionPointWithElement[] = [] // ToDo: replace with Map
  public element: HTMLElement | null = null

  #parsedContext: any = {}
  #eventEmitter = new EventEmitter<TreeNodeEvents>()

  public get parsedContext() {
    return this.#parsedContext
  }

  public set parsedContext(parsedContext: any) {
    this.#parsedContext = parsedContext
    this.#eventEmitter.emit('contextChanged', {})
  }

  constructor(
    namespace: string,
    contextType: string,
    parsedContext: any = {},
    insPoints: InsertionPointWithElement[] = [],
    element: HTMLElement | null = null
  ) {
    this.namespace = namespace
    this.contextType = contextType
    this.parsedContext = parsedContext
    this.insPoints = insPoints
    this.element = element

    // ToDo: the similar logic is in tree builder
    this.id = parsedContext.id ?? null
  }

  removeChild(child: IContextNode): void {
    child.parentNode = null
    this.children = this.children.filter((c) => c !== child)
    this.#eventEmitter.emit('childContextRemoved', { child })
  }

  appendChild(child: IContextNode): void {
    child.parentNode = this
    this.children.push(child)
    this.#eventEmitter.emit('childContextAdded', { child })
  }

  public on<EventName extends keyof TreeNodeEvents>(
    eventName: EventName,
    callback: (event: TreeNodeEvents[EventName]) => void
  ): Subscription {
    return this.#eventEmitter.on(eventName, callback)
  }
}
