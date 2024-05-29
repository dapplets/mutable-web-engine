import { IContextNode } from '../core/tree/types'

export class InsertionPointFinishedEvent extends Event {
  constructor(
    public context: IContextNode,
    public insPointName: string
  ) {
    super('insertion-point-finished')
  }
}
