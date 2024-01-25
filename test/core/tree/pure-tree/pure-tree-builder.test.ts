import {
  IContextListener,
  IContextNode,
  ITreeBuilder,
  ParsedContext,
} from "../../../../src/core/tree/types";
import { PureTreeBuilder } from "../../../../src/core/tree/pure-tree/pure-tree-builder";
import { InsertionType } from "../../../../src/core/adapters/interface";
import { ParserConfig } from "../../../../src/core/parsers/json-parser";

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

  constructor(config: ParserConfig) {
    this.config = config;
  }

  handleContextStarted(context: IContextNode): void {
    console.log(`Context started for node with tagName: ${context.tagName}`);
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
describe("Pure tree builder", () => {
  let ns: string;
  let treeBuilder: ITreeBuilder;

  let rootNode: IContextNode;
  let headNode: IContextNode;

  beforeEach(() => {
    ns = "https://dapplets.org/ns/json/some-web-site";
    rootNode = new MockContextNode("root", "html", ns, null, { lang: "en" });
    headNode = new MockContextNode("head", "div", ns, null);
    treeBuilder = new PureTreeBuilder(new SimpleContextListener(config));
  });

  it("tree build append child", () => {
    expect(treeBuilder.appendChild(rootNode, headNode));
  });
});
