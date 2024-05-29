import { IContextNode } from '../core/tree/types'

export class ContextFinishedEvent extends Event {
  constructor(public context: IContextNode) {
    super('context-finished')
  }
}
