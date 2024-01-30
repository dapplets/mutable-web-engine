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
    rootNode = new PureContextNode(ns, "html"); // ToDo: mock
    headNode = new PureContextNode(ns, "div"); // ToDo: mock
    listeners = {
      handleContextStarted: jest.fn(() => undefined),
      handleContextChanged: jest.fn(() => undefined),
      handleContextFinished: jest.fn(() => undefined),
      handleInsPointStarted: jest.fn(() => undefined),
      handleInsPointFinished: jest.fn(() => undefined),
    };
    treeBuilder = new PureTreeBuilder(listeners); // ToDo: mock
  });

  it("tree build append child", () => {
    expect(headNode.parentNode).toBe(null);
    expect(treeBuilder.appendChild(rootNode, headNode));

    expect(headNode.parentNode).toStrictEqual(rootNode);
    // ToDo: check that handleContextStarted was called with correct arguments
  });

  it("tree build remove child", () => {
    expect(treeBuilder.appendChild(rootNode, headNode));
    expect(headNode.parentNode).toStrictEqual(rootNode);
    expect(treeBuilder.removeChild(rootNode, headNode));
    expect(headNode.parentNode).toBe(null);
    // ToDo: check that handleContextFinished was called with correct arguments
  });

  it("tree build create node", () => {
    expect(treeBuilder.createNode(ns, "span").tagName).toBe("span");
  });

  it("tree build update parsed context", () => {
    expect(treeBuilder.updateParsedContext(rootNode, "new context"));
    expect(rootNode.parsedContext).toBe("new context");
    // ToDo: check that handleContextChanged was called with correct arguments
  });

  it("update Insertion Points", () => {
    expect(rootNode.insPoints.length).toBe(0);
    expect(treeBuilder.updateInsertionPoints(rootNode, ["InsertionPoints"]));
    expect(rootNode.insPoints[0]).toBe("InsertionPoints");
    // ToDo: check that handleInsPointStarted and handleInsPointFinished were called with correct arguments
  });
});
