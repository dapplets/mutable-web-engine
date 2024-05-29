import { IContextNode } from '../core/tree/types'

export class InsertionPointStartedEvent extends Event {
  constructor(
    public context: IContextNode,
    public insPointName: string
  ) {
    super('insertion-point-started')
  }
}
