import { DynamicHtmlAdapter } from "../../../../src/core/adapters/dynamic-html-adapter";
import {
  IAdapter,
  InsertionType,
} from "../../../../src/core/adapters/interface";

import { describe, expect, it, beforeEach, jest } from "@jest/globals";

import { dynamicHtmlAdapterDataHtml } from "../../../data/adapters/dynamic-html-adapter-constants";
import { mockedJsonParser, mockedTreeBuilder } from "../../../helpers";

const NS = "https://dapplets.org/ns/engine";

describe("dynamic-html-adapter", () => {
  let adapter: IAdapter;

  beforeEach(() => {
    adapter = new DynamicHtmlAdapter(
      dynamicHtmlAdapterDataHtml,
      mockedTreeBuilder,
      NS,
      mockedJsonParser
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

  it("append node", () => {
    // Arrange
    const node = adapter.context;

    const expected = document.createElement("div");
    expected.innerHTML = `
    <div class="post-selector-point" id="post" 
    data-testid="postTestId">

        <div class="post-root-selector" data-testid='postText' data-bos-layout-manager="layoutManager1">Post Root Insertion Point Content</div>

        <div class="post-text-selector" data-bos-layout-manager="layoutManager1">Post Text Insertion Point Content</div>
    </div>
    `;

    // Act
    dynamicHtmlAdapterDataHtml
      .getElementsByClassName("root-selector")[0]
      .append(expected);

    // Assert
    adapter.stop();
    expect(node.children.length).toBe(2);
    adapter.start();
    expect(node.children.length).toBe(3);
    expect(expected.parentElement).toBe(
      dynamicHtmlAdapterDataHtml.getElementsByClassName("root-selector")[0]
    );
  });

  it("remove node", () => {
    // Arrange

    const node = adapter.context;

    // Act
    adapter.stop();
    dynamicHtmlAdapterDataHtml
      .getElementsByClassName("post-selector-point")[0]
      .remove();

    // Assert
    expect(node.children.length).toBe(3);
    adapter.start();
    expect(node.children.length).toBe(2);
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
