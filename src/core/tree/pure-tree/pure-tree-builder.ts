import { DappletsEngineNs } from '../../constants'
import { EventEmitter } from '../../event-emitter'
import { isDeepEqual } from '../../utils'
import { IContextNode, ITreeBuilder, InsertionPointWithElement, ParsedContext } from '../types'
import { PureContextNode } from './pure-context-node'

export type TreeBuilderEvents = {
  contextStarted: { context: IContextNode }
  contextFinished: { context: IContextNode }
  contextChanged: { context: IContextNode; previousContext: ParsedContext }
  insertionPointStarted: { context: IContextNode; insertionPoint: InsertionPointWithElement }
  insertionPointFinished: { context: IContextNode; insertionPoint: InsertionPointWithElement }
  notificationCreate: { context: any; notification: any }
}

export class PureTreeBuilder implements ITreeBuilder {
  root: IContextNode // ToDo: replace with Root Adapter

  constructor(private _eventEmitter: EventEmitter<TreeBuilderEvents>) {
    // ToDo: move to engine, it's not a core responsibility
    this.root = this.createNode(DappletsEngineNs, 'website') // default ns
  }
  notificationCreate(parent: IContextNode, notify: any): void {
    this._emitnotificationCreate(parent, notify)

    this._eventEmitter.emit('notificationCreate', notify)
  }

  appendChild(parent: IContextNode, child: IContextNode): void {
    parent.appendChild(child)
    this._emitContextStarted(child)
    child.insPoints?.forEach((ip) => this._emitInsPointStarted(child, ip))
  }

  removeChild(parent: IContextNode, child: IContextNode): void {
    parent.removeChild(child)
    this._emitContextFinished(child)
    child.insPoints?.forEach((ip) => this._emitInsPointFinished(child, ip))
  }

  createNode(
    namespace: string,
    contextType: string,
    parsedContext: any = {},
    insPoints: InsertionPointWithElement[] = [],
    element: HTMLElement | null = null
  ): IContextNode {
    return new PureContextNode(namespace, contextType, parsedContext, insPoints, element)
  }

  createNotification(parent: IContextNode, notify: any) {}

  updateParsedContext(context: IContextNode, newParsedContext: any): void {
    const oldParsedContext = context.parsedContext

    // ToDo: what to do with contexts without IDs?

    if (oldParsedContext?.id !== newParsedContext?.id) {
      // ToDo: remove child?
      this._emitContextFinished(context)
      context.parsedContext = newParsedContext
      context.id = newParsedContext.id
      this._emitContextStarted(context)
    } else if (!isDeepEqual(oldParsedContext, newParsedContext)) {
      context.parsedContext = newParsedContext
      this._emitContextChanged(context, oldParsedContext)
    }
  }

  updateInsertionPoints(context: IContextNode, foundIPs: InsertionPointWithElement[]): void {
    // IPs means insertion points
    const existingIPs = context.insPoints ?? []

    const oldIPs = existingIPs.filter((ip) => !foundIPs.some((_ip) => _ip.name === ip.name))
    const newIPs = foundIPs.filter((ip) => !existingIPs.some((_ip) => _ip.name === ip.name))

    // Remove old IPs from context.insPoints
    oldIPs.forEach((ip) => {
      context.removeInsPoint(ip.name)
      this._emitInsPointFinished(context, ip)
    })

    // Add new IPs to context.insPoints
    newIPs.forEach((ip) => {
      context.appendInsPoint(ip)
      this._emitInsPointStarted(context, ip)
    })
  }

  clear() {
    // ToDo: move to engine, it's not a core responsibility
    this.root = this.createNode(DappletsEngineNs, 'website') // default ns
  }

  private _emitContextStarted(context: IContextNode) {
    this._eventEmitter.emit('contextStarted', { context })
  }

  private _emitContextChanged(context: IContextNode, previousContext: ParsedContext) {
    this._eventEmitter.emit('contextChanged', { context, previousContext })
  }

  private _emitContextFinished(context: IContextNode) {
    this._eventEmitter.emit('contextFinished', { context })
  }

  private _emitInsPointStarted(context: IContextNode, insertionPoint: InsertionPointWithElement) {
    this._eventEmitter.emit('insertionPointStarted', {
      context,
      insertionPoint,
    })
  }

  private _emitInsPointFinished(context: IContextNode, insertionPoint: InsertionPointWithElement) {
    this._eventEmitter.emit('insertionPointFinished', {
      context,
      insertionPoint,
    })
  }

  private _emitnotificationCreate(context: any, notification: any) {
    this._eventEmitter.emit('notificationCreate', {
      context,
      notification,
    })
  }
}
