import {
  IContextListener,
  IContextNode,
  ITreeBuilder,
} from "../../../../src/core/tree/types";
import { PureTreeBuilder } from "../../../../src/core/tree/pure-tree/pure-tree-builder";
import { PureContextNode } from "../../../../src/core/tree/pure-tree/pure-context-node";
import { describe, expect, it, beforeEach, jest } from "@jest/globals";

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
    // ToDo: check that handleContextStarted was called with correct arguments
    expect(listeners.handleContextStarted.call).toHaveLength(1);
    expect(headNode.parentNode).toStrictEqual(rootNode);
  });

  it("tree build remove child", () => {
    expect(treeBuilder.appendChild(rootNode, headNode));
    expect(headNode.parentNode).toStrictEqual(rootNode);
    expect(treeBuilder.removeChild(rootNode, headNode));
    // ToDo: check that handleContextFinished was called with correct arguments
    expect(listeners.handleContextFinished.call).toHaveLength(1);
    expect(headNode.parentNode).toBe(null);
  });

  it("tree build create node", () => {
    expect(treeBuilder.createNode(ns, "span").tagName).toBe("span");
  });

  it("tree build update parsed context", () => {
    expect(treeBuilder.updateParsedContext(rootNode, "new context"));
    // ToDo: check that handleContextChanged was called with correct arguments
    expect(listeners.handleContextChanged.call).toHaveLength(1);
    expect(rootNode.parsedContext).toBe("new context");
  });

  it("update Insertion Points", () => {
    expect(rootNode.insPoints.length).toBe(0);

    expect(treeBuilder.updateInsertionPoints(rootNode, ["InsertionPoints"]));
    // ToDo: check that handleInsPointStarted and handleInsPointFinished were called with correct arguments
    expect(listeners.handleInsPointStarted.call).toHaveLength(1);
    expect(listeners.handleInsPointFinished.call).toHaveLength(1);
    expect(rootNode.insPoints[0]).toBe("InsertionPoints");
  });
});
