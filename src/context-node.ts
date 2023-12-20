export type ParsedContext = Record<
  string,
  string | number | boolean | null | undefined
>;

export class ContextNode {
  children: ContextNode[] = [];
  parent: ContextNode | null = null;
  type: string;
  props: ParsedContext = {}; // parsed props
  element: Element;
  insertionPoints: Record<string, string>;

  constructor(
    type: string,
    element: Element,
    insertionPoints: Record<string, string>
  ) {
    this.type = type;
    this.element = element;
    this.insertionPoints = insertionPoints;
  }

  addChild(node: ContextNode) {
    node.parent = this;
    this.children.push(node);
  }

  removeChild(node: ContextNode) {
    this.children.splice(this.children.indexOf(node), 1);
  }

  injectElement(el: HTMLElement, insertionPoint: string) {
    const insertionPointSelector = this.insertionPoints[insertionPoint];
    if (!insertionPointSelector) {
      console.error(`Insertion point ${insertionPoint} not found`);
      return;
    }
    const insertionPointElement = this.element.querySelector(
      insertionPointSelector
    );
    if (!insertionPointElement) {
      console.error(`Insertion point ${insertionPoint} not found`);
      return;
    }
    insertionPointElement.appendChild(el);
  }
}
