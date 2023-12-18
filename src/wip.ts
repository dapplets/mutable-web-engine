/////// JSON ADAPTER SPECIFIC LOGIC ///////

type ParsedContext = Record<
  string,
  string | number | boolean | null | undefined
>;

type NamespaceRef = string;

// ToDo: rename
type Context = {
  namespace: NamespaceRef; // adapter or virtual adapter name "alsakhaev.com"
  name: string; // context name
  value: ParsedContext; // parsed props
};

class SemNode {
  techId: any; // ToDo: remove and use reference
  children: SemNode[] = [];
  parent: SemNode | null = null;
  props: Map<NamespaceRef, Context> = new Map();

  addChild(node: SemNode) {
    node.parent = this;
    this.children.push(node);
  }

  removeChild(node: SemNode) {
    this.children.splice(this.children.indexOf(node), 1);
  }

  // ToDo: addContext, removeContext ?
}
