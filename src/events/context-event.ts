import { ContextNode } from "../context-node";

export class ContextEvent extends Event {
  public readonly context: ContextNode;

  constructor(type: string, context: ContextNode) {
    super(type);
    this.context = context;
  }
}
