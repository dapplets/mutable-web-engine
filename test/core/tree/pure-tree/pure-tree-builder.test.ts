import {
  IContextListener,
  IContextNode,
  ITreeBuilder,
} from "../../../../src/core/tree/types";
import { PureTreeBuilder } from "../../../../src/core/tree/pure-tree/pure-tree-builder";
import { PureContextNode } from "../../../../src/core/tree/pure-tree/pure-context-node";

// const config = {
//   namespace: "sampleNamespace",
//   contexts: {
//     root: {
//       selector: ".context1-selector",
//       props: {
//         id: "string('root')",
//       },
//       children: ["post", "profile"],
//       insertionPoints: {
//         insertionPoint1: {
//           selector: ".insertion-point-selector",
//           bosLayoutManager: "layoutManager1",
//           insertionType: InsertionType.After,
//         },
//         insertionPoint2: "data-insertion-point",
//       },
//     },
//     post: {
//       insertionPoints: {
//         insertionPoint1: {
//           selector: ".insertion-point-selector",
//           bosLayoutManager: "layoutManager1",
//           insertionType: InsertionType.After,
//         },
//         insertionPoint2: "data-insertion-point",
//       },
//     },
//     profile: {},
//   },
// };

// class SimpleContextListener implements IContextListener {
//   config: ParserConfig;

//   constructor(config: ParserConfig) {
//     this.config = config;
//   }

//   handleContextStarted(context: IContextNode): void {
//     console.log(`Context started for node with tagName: ${context.tagName}`);
//   }

//   handleContextChanged(context: IContextNode, oldParsedContext: any): void {
//     console.log(`Context changed for node with tagName: ${context.tagName}`);
//     console.log("Old Parsed Context:", oldParsedContext);
//     console.log("New Parsed Context:", context.parsedContext);
//   }

//   handleContextFinished(context: IContextNode): void {
//     console.log(`Context finished for node with tagName: ${context.tagName}`);
//   }
// }

describe("Pure tree builder", () => {
  let ns: string;
  let treeBuilder: ITreeBuilder;

  let rootNode: IContextNode;
  let headNode: IContextNode;

  let listeners: IContextListener;
  beforeEach(() => {
    ns = "https://dapplets.org/ns/engine";
    rootNode = new PureContextNode(ns, "html");
    headNode = new PureContextNode(ns, "div");
    listeners = {
      handleContextStarted: jest.fn(() => undefined),
      handleContextChanged: jest.fn(() => undefined),
      handleContextFinished: jest.fn(() => undefined),
    };
    treeBuilder = new PureTreeBuilder(listeners);
  });

  // todo: works, but don't check?
  it("tree build append child", () => {
    expect(treeBuilder.appendChild(rootNode, headNode));
  });
  // todo: works, but don't check?
  it("tree build remove child", () => {
    expect(treeBuilder.removeChild(rootNode, headNode));
  });
  // todo: works, but don't check?
  it("tree build create node", () => {
    expect(treeBuilder.createNode(ns, "div"));
  });

  it("tree build update parsed context", () => {
    expect(treeBuilder.updateParsedContext(rootNode, "new context"));
    expect(rootNode.parsedContext).toBe("new context");
  });
});
