import { DynamicHtmlAdapter } from "../../../../src/core/adapters/dynamic-html-adapter";
import { IAdapter, InsertionType } from "../../../../src/core/adapters/interface";
import { IParser } from "../../../../src/core/parsers/interface";
import { JsonParser } from "../../../../src/core/parsers/json-parser";
import { describe, expect, it, beforeEach, jest } from "@jest/globals";
import { PureContextNode } from "../../../../src/core/tree/pure-tree/pure-context-node";
import { PureTreeBuilder } from "../../../../src/core/tree/pure-tree/pure-tree-builder";
import { IContextListener, ITreeBuilder } from "../../../../src/core/tree/types";
import {
  config,
  dynamicHtmlAdapterDataHtml,
} from "../../../data/adapters/dynamic-html-adapter-constants";

const NS = "https://dapplets.org/ns/engine";

describe("dynamic-html-adapter", () => {
  let adapter: IAdapter;

  let mockListeners: IContextListener;
  let treeBuilder: ITreeBuilder;
  let jsonParser: IParser;

  beforeEach(() => {
    // ToDo: it should be tested in tree-builder tree.
    mockListeners = {
      handleContextStarted: jest.fn(() => undefined),
      handleContextChanged: jest.fn(() => undefined),
      handleContextFinished: jest.fn(() => undefined),
      handleInsPointStarted: jest.fn(() => undefined),
      handleInsPointFinished: jest.fn(() => undefined),
    };

    // ToDo: these classes should be mocked

    treeBuilder = new PureTreeBuilder(mockListeners);
    jsonParser = new JsonParser(config);

    adapter = new DynamicHtmlAdapter(
      dynamicHtmlAdapterDataHtml,
      treeBuilder,
      NS,
      jsonParser
    );

    adapter.start();
  });

  it("parse adapter context", () => {
    // Arrange
    const expected = {
      id: "root",
      insPoints: ["rootPoints"],
      namespaceURI: NS,
      parentNode: null,
      parsedContext: {
        fullname: "Test-fullname",
        id: "root",
        img: null,
        username: "2",
      },
      tagName: "root",
    };

    // Act
    const node = adapter.context;

    // Assert

    expect(node.id).toBe(expected.id);
    expect(node.insPoints).toStrictEqual(expected.insPoints);
    expect(node.namespaceURI).toBe(expected.namespaceURI);
    expect(node.parentNode).toBe(expected.parentNode);
    expect(node.parsedContext).toStrictEqual(expected.parsedContext);
    expect(node.tagName).toBe(expected.tagName);
  });

  it("append node context", () => {
    // Arrange
    const node = adapter.context;
    const child = new PureContextNode(NS, "child");

    // Act
    node.appendChild(child);
    // Assert
    expect(child.parentNode).toBe(node);
  });

  it("remove node context", () => {
    // Arrange
    const node = adapter.context;
    const child = new PureContextNode(NS, "child");
    node.appendChild(child);

    // Act
    node.removeChild(child);
    // Assert
    expect(child.parentNode).toBe(null);
  });

  it("inject element before", () => {
    // Arrange
    const injectElement = document.createElement("p");
    injectElement.setAttribute("id", "inject");
    injectElement.innerText = "Injecting Widget";
    const expected =
      dynamicHtmlAdapterDataHtml.getElementsByClassName("post-text-selector")[0]
        .textContent;

    // Act
    adapter.injectElement(
      injectElement,
      adapter.context,
      "rootPoints",
      InsertionType.Before
    );

    // Assert
    expect(
      dynamicHtmlAdapterDataHtml
        .querySelector("p")
        ?.previousSibling?.textContent?.trim()
    ).toBe("");
    expect(
      dynamicHtmlAdapterDataHtml
        .querySelector("p")
        ?.nextSibling?.textContent?.trim()
    ).toContain(expected);
    expect(dynamicHtmlAdapterDataHtml.querySelector("p")).toBe(injectElement);
    expect(
      dynamicHtmlAdapterDataHtml.querySelector("p")?.getAttribute("id")
    ).toBe("inject");
  });

  it("inject element after", () => {
    // Arrange
    const injectElement = document.createElement("p");
    injectElement.setAttribute("id", "inject");
    injectElement.innerText = "Injecting Widget";
    const expected =
      dynamicHtmlAdapterDataHtml.getElementsByClassName("post-root-selector")[0]
        .textContent;

    // Act
    adapter.injectElement(
      injectElement,
      adapter.context,
      "rootPoints",
      InsertionType.After
    );

    // Assert
    expect(
      dynamicHtmlAdapterDataHtml
        .querySelector("p")
        ?.nextSibling?.textContent?.trim()
    ).toContain(expected);
    expect(
      dynamicHtmlAdapterDataHtml
        .querySelector("p")
        ?.previousSibling?.textContent?.trim()
    ).toBe("");
    expect(dynamicHtmlAdapterDataHtml.querySelector("p")).toStrictEqual(
      injectElement
    );
    expect(
      dynamicHtmlAdapterDataHtml.querySelector("p")?.getAttribute("id")
    ).toBe("inject");
  });

  it("inject element end", () => {
    // Arrange
    const injectElement = document.createElement("a");
    injectElement.setAttribute("id", "injectEnd");
    injectElement.innerText = "Injecting Widget";
    const expected =
      dynamicHtmlAdapterDataHtml.getElementsByClassName(
        "post-text-selector"
      )[0];
    // Act
    adapter.injectElement(
      injectElement,
      adapter.context,
      "rootPoints",
      InsertionType.End
    );

    // Assert
    expect(
      dynamicHtmlAdapterDataHtml.querySelector("a")?.nextElementSibling
    ).toStrictEqual(null);
    expect(
      dynamicHtmlAdapterDataHtml.querySelector("a")?.previousElementSibling
    ).toStrictEqual(expected);

    expect(dynamicHtmlAdapterDataHtml.querySelector("a")).toStrictEqual(
      injectElement
    );
    expect(
      dynamicHtmlAdapterDataHtml.querySelector("a")?.getAttribute("id")
    ).toBe("injectEnd");
  });

  it("inject element begin", () => {
    // Arrange
    const injectElement = document.createElement("a");
    injectElement.setAttribute("id", "injectEnd");
    injectElement.innerText = "Injecting Widget";
    const expected =
      dynamicHtmlAdapterDataHtml.getElementsByClassName(
        "post-root-selector"
      )[0];
    // Act
    adapter.injectElement(
      injectElement,
      adapter.context,
      "rootPoints",
      InsertionType.Begin
    );

    // Assert
    expect(
      dynamicHtmlAdapterDataHtml.querySelector("a")?.nextElementSibling
    ).toStrictEqual(expected);
    expect(
      dynamicHtmlAdapterDataHtml.querySelector("a")?.previousElementSibling
    ).toStrictEqual(null);

    expect(dynamicHtmlAdapterDataHtml.querySelector("a")).toStrictEqual(
      injectElement
    );
    expect(
      dynamicHtmlAdapterDataHtml.querySelector("a")?.getAttribute("id")
    ).toBe("injectEnd");
  });

  it("get insertion points", () => {
    // Arrange
    const expected = [
      {
        name: "rootPoints",
        insertionType: "after",
        bosLayoutManager: "layoutManager1",
      },
      {
        name: "inject",
        insertionType: "after",
        bosLayoutManager: "layoutManager1",
      },
    ];
    // Act
    const actual = adapter.getInsertionPoints(adapter.context);
    // Assert
    expect(actual).toStrictEqual(expected);
  });
});
