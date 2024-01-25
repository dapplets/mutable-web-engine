import {
  IContextListener,
  IContextNode,
  ITreeBuilder,
  ParsedContext,
} from "../../../../src/core/tree/types";
import { DomTreeBuilder } from "../../../../src/core/tree/dom-tree/dom-tree-builder";
import { InsertionType } from "../../../../src/core/adapters/interface";
import { ParserConfig } from "../../../../src/core/parsers/json-parser";
import { PureContextNode } from "../../../../src/core/tree/pure-tree/pure-context-node";

const config = {
  namespace: "sampleNamespace",
  contexts: {
    root: {
      selector: ".context1-selector",
      props: {
        id: "string('root')",
      },
      children: ["post", "profile"],
      insertionPoints: {
        insertionPoint1: {
          selector: ".insertion-point-selector",
          bosLayoutManager: "layoutManager1",
          insertionType: InsertionType.After,
        },
        insertionPoint2: "data-insertion-point",
      },
    },
    post: {
      insertionPoints: {
        insertionPoint1: {
          selector: ".insertion-point-selector",
          bosLayoutManager: "layoutManager1",
          insertionType: InsertionType.After,
        },
        insertionPoint2: "data-insertion-point",
      },
    },
    profile: {},
  },
};

class SimpleContextListener implements IContextListener {
  config: ParserConfig;
  started: boolean = false;
  constructor(config: ParserConfig) {
    this.config = config;
  }

  handleContextStarted(context: IContextNode): void {
    console.log(`Context started for node with tagName: ${context.tagName}`);
    console.log(context, "context");
  }

  handleContextChanged(context: IContextNode, oldParsedContext: any): void {
    console.log(`Context changed for node with tagName: ${context.tagName}`);
    console.log("Old Parsed Context:", oldParsedContext);
    console.log("New Parsed Context:", context.parsedContext);
  }

  handleContextFinished(context: IContextNode): void {
    console.log(`Context finished for node with tagName: ${context.tagName}`);
  }
}

class MockContextNode implements IContextNode {
  id: string | null;
  tagName: string;
  namespaceURI: string | null;
  parentNode: IContextNode | null;
  parsedContext?: ParsedContext;

  constructor(
    id: string | null,
    tagName: string,
    namespaceURI: string | null,
    parentNode: IContextNode | null,
    parsedContext?: ParsedContext
  ) {
    this.id = id;
    this.tagName = tagName;
    this.namespaceURI = namespaceURI;
    this.parentNode = parentNode;
    this.parsedContext = parsedContext;
  }

  removeChild(child: IContextNode): void {
    console.log(`Removing child ${child.tagName} from ${this.tagName}`);
  }

  appendChild(child: IContextNode): void {
    console.log(`Appending child ${child.tagName} to ${this.tagName}`);
  }
}
// todo: dont work
describe("Dom tree builder", () => {
  let ns: string;
  let treeBuilder: ITreeBuilder;
  let contextNode: IContextNode;
  let contextChildNode: IContextNode;
  let rootNode: IContextNode;
  let headNode: IContextNode;

  beforeEach(() => {
    ns = "https://dapplets.org/ns/json/some-web-site";
    rootNode = new MockContextNode("app", "div", ns, null, { lang: "en" });
    headNode = new MockContextNode("head", "p", ns, null);
    // contextNode = new PureContextNode(ns, "div");
    // contextChildNode = new PureContextNode(ns, "p");
    treeBuilder = new DomTreeBuilder(new SimpleContextListener(config));
  });

  it("tree build append child", () => {
    console.log(treeBuilder, "treeBuilder");
    console.log(rootNode, "rootNode start");
    console.log(headNode, "headNode start");
    expect(treeBuilder.appendChild(rootNode, headNode));
    console.log(treeBuilder, "treeBuilder");

    console.log(rootNode, "rootNode end");
    console.log(headNode, "headNode end");
  });
});
