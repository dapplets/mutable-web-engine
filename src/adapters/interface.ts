import { ContextNode } from "../context-node";

export interface IAdapter extends EventTarget {
  root: ContextNode;
  start(): void;
  stop(): void;
}
