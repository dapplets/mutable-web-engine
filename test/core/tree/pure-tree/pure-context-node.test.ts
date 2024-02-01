import { PureContextNode } from "../../../../src/core/tree/pure-tree/pure-context-node";
import { describe, expect, it } from "@jest/globals";

const NS = "https://dapplets.org/ns/engine";

describe("PureContextNode", () => {
  it('initializes properties', () => {
    // Arrange
    const contextType = "root";
    
    // Act
    const node = new PureContextNode(NS, contextType);

    // Assert
    expect(node.children.length).toBe(0);
    expect(node.parentNode).toBe(null);
    expect(node.id).toBe(null);
    expect(node.insPoints.length).toBe(0);
    expect(node.namespaceURI).toBe(NS);
    expect(node.tagName).toBe(contextType);
  })

  it("context node append child", () => {
    // Arrange
    const parent = new PureContextNode(NS, "parent");
    const children = new PureContextNode(NS, "children");

    // Act
    parent.appendChild(children);

    // Assert
    expect(children.parentNode).toBe(parent);
    expect(parent.children).toContain(children);
  });

  it("context node remove child", () => {
    // Arrange
    const parent = new PureContextNode(NS, "parent");
    const children = new PureContextNode(NS, "children");
    parent.appendChild(children);

    // Act
    parent.removeChild(children);

    // Assert
    expect(children.parentNode).toBe(null);
    expect(parent.children).not.toContain(children);
  });
});
