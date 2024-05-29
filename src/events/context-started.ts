import { IContextNode } from '../core/tree/types'

export class ContextStartedEvent extends Event {
  constructor(
    public context: IContextNode,
    public element: Element
  ) {
    super('context-started')
  }
}
