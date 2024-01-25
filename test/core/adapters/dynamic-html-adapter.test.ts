import { DynamicHtmlAdapter } from "../../../src/core/adapters/dynamic-html-adapter";
import { IAdapter, InsertionType } from "../../../src/core/adapters/interface";
import { IParser } from "../../../src/core/parsers/interface";
import { JsonParser } from "../../../src/core/parsers/json-parser";
import {
  IContextListener,
  IContextNode,
  ITreeBuilder,
} from "../../../src/core/tree/types";
import { DomTreeBuilder } from "../../../src/core/tree/dom-tree/dom-tree-builder";
import { PureContextNode } from "../../../src/core/tree/pure-tree/pure-context-node";

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

describe("dynamic-html-adapter", () => {
  let element: HTMLElement;
  let ns: string;
  let adapter: IAdapter;

  let listeners: IContextListener;
  let treeBuilder: ITreeBuilder;
  let jsonParser: IParser;
  let targetNode: IContextNode;
  let injectElement: HTMLElement;

  beforeEach(() => {
    element = document.createElement("div");
    element.innerHTML = `  <div id="root">
    <div class="context1-selector" id='test' data-context="context1">
    <p data-prop1="value1" data-prop2="value2">Context 1 Content</p>
    <p id="value1" data-prop2="value2">Context 1 Content</p>
      <div data-insertion-point="insertionPoint1" class="insertion-point-selector">
        Insertion Point 1 Content
      </div>
      <div data-insertion-point="insertionPoint2">
        Insertion Point 2 Content
      </div>
      <div data-child="child1">Child 1 Content</div>
      <div data-child="child2">Child 2 Content</div>
    </div>
  </div>`;

    injectElement = document.createElement("div");
    injectElement.innerHTML = `  <div id="root">
    <p data-prop1="value1" data-prop2="value2">Context 1 Content</p>
   `;
    listeners = {
      handleContextStarted: jest.fn(() => undefined),
      handleContextChanged: jest.fn(() => undefined),
      handleContextFinished: jest.fn(() => undefined),
    };
    ns = "https://dapplets.org/ns/json/some-web-site";
    targetNode = new PureContextNode(ns, "p");
    treeBuilder = new DomTreeBuilder(listeners);

    jsonParser = new JsonParser(config);
    adapter = new DynamicHtmlAdapter(element, treeBuilder, ns, jsonParser);

    adapter.start();
  });

  it("parsed context", () => {
    expect(adapter.context.parsedContext).toHaveProperty("id", "root");
  });

  it("get insertion points", () => {
    expect(adapter.getInsertionPoints(targetNode).length).toBe(0);
  });

  // todo: how check?
  it("inject element", () => {
    expect(
      adapter.injectElement(
        injectElement,
        adapter.context,
        "root",
        InsertionType.Before
      )
    );
  });

  it("adapter namespace", () => {
    expect(adapter.namespace).toBe(
      "https://dapplets.org/ns/json/some-web-site"
    );
  });
});
