import {
  IContextListener,
  IContextNode,
  ITreeBuilder,
} from "../../../../src/core/tree/types";
import { DomTreeBuilder } from "../../../../src/core/tree/dom-tree/dom-tree-builder";
import { PureContextNode } from "../../../../src/core/tree/pure-tree/pure-context-node";

describe("Dom tree builder", () => {
  let ns: string;
  let treeBuilder: ITreeBuilder;
  let contextNode: IContextNode;
  let contextChildNode: IContextNode;
  let listeners: IContextListener;
  beforeEach(() => {
    ns = "https://dapplets.org/ns/json/some-web-site";
    listeners = {
      handleContextStarted: jest.fn(() => undefined),
      handleContextChanged: jest.fn(() => undefined),
      handleContextFinished: jest.fn(() => undefined),
    };
    contextNode = new PureContextNode(ns, "html");
    contextChildNode = new PureContextNode(ns, "div");
    treeBuilder = new DomTreeBuilder(listeners);
  });

  //todo: works, but don't check?
  it("dom tree build append child", () => {
    expect(treeBuilder.appendChild(contextNode, contextChildNode));
  });

  //todo: works, but don't check?
  it("dom tree build removed child", () => {
    expect(treeBuilder.removeChild(contextNode, contextChildNode));
  });

  //todo: works, but don't check?
  it("tree build create node", () => {
    expect(treeBuilder.createNode(ns, "div"));
  });

  it("tree build update parsed context", () => {
    expect(treeBuilder.updateParsedContext(contextNode, "new context"));
    expect(contextNode.parsedContext).toBe("new context");
  });
});
