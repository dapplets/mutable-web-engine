import { IContextNode } from '../core/tree/types'

export class ContextChangedEvent extends Event {
  constructor(public context: IContextNode) {
    super('context-changed')
  }
}
