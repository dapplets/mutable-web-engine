import { IContextNode } from "../../../../src/core/tree/types";
import { PureContextNode } from "../../../../src/core/tree/pure-tree/pure-context-node";
import { describe, expect, it, beforeEach } from "@jest/globals";


describe("Pure context node", () => {
  let ns: string;
  let pureContextNode: IContextNode;
  let expectedNode: IContextNode;

  beforeEach(() => {
    ns = "https://dapplets.org/ns/json/some-web-site";
    expectedNode = new PureContextNode(ns, "https://expected.org");
    pureContextNode = new PureContextNode(ns, "div");
  });

  it("context node append child", () => {
    expect(expectedNode.parentNode).toBe(null);

    expect(pureContextNode.appendChild(expectedNode));

    expect(expectedNode.parentNode?.namespaceURI).toBe(
      "https://dapplets.org/ns/json/some-web-site"
    );
  });

  it("context node remove child", () => {
    expect(expectedNode.parentNode?.namespaceURI).toBe(undefined);

    expect(pureContextNode.removeChild(expectedNode));

    expect(expectedNode.parentNode).toBe(null);
  });
});
