import { IContextNode, ParsedContext } from "../../../../src/core/tree/types";
import { PureContextNode } from "../../../../src/core/tree/pure-tree/pure-context-node";

class MockContextNode implements IContextNode {
  id: string | null;
  tagName: string;
  namespaceURI: string | null;
  parentNode: IContextNode | null;
  parsedContext?: ParsedContext;
  children?: any;

  constructor(
    id: string | null,
    tagName: string,
    namespaceURI: string | null,
    parentNode: IContextNode | null,
    parsedContext?: ParsedContext,
    children?: any
  ) {
    this.id = id;
    this.tagName = tagName;
    this.namespaceURI = namespaceURI;
    this.parentNode = parentNode;
    this.parsedContext = parsedContext;
    this.children = children;
  }

  removeChild(child: IContextNode): void {
    console.log(`Removing child ${child.tagName} from ${this.tagName}`);
  }

  appendChild(child: IContextNode): void {
    console.log(`Appending child ${child.tagName} to ${this.tagName}`);
  }
}
describe("Pure context node", () => {
  let ns: string;
  let contextNode: IContextNode;

  let rootNode = new MockContextNode("parent", "div", null, null, {
    class: "root",
  });

  beforeEach(() => {
    ns = "https://dapplets.org/ns/json/some-web-site";
    contextNode = new PureContextNode(ns, "div");
  });

  it("context node append child", () => {
    expect(rootNode.parentNode).toBe(null);

    expect(contextNode.appendChild(rootNode));
    expect(rootNode.parentNode?.namespaceURI).toBe(
      "https://dapplets.org/ns/json/some-web-site"
    );
  });

  it("context node remove child", () => {
    expect(rootNode.parentNode?.namespaceURI).toBe(
      "https://dapplets.org/ns/json/some-web-site"
    );

    expect(contextNode.removeChild(rootNode));
    expect(rootNode.parentNode).toBe(null);
  });
});
