import { ParsedContext } from "../context-node";
import { getChildContextElements } from "./bos-adapter";
import { DynamicHtmlAdapter } from "./dynamic-html-adapter";
import { IAdapter } from "./interface";

export class MicrodataAdapter extends DynamicHtmlAdapter implements IAdapter {
  override parseContext() {
    const result: ParsedContext = {};

    const elements = getChildContextElements(this.root.element, "itemprop");

    for (const element of elements) {
      const propName = element.getAttribute("itemprop")!;
      result[propName] = MicrodataAdapter.getPropertyValue(element);
    }

    if (this.root.element.hasAttribute("itemid")) {
      result.id = this.root.element.getAttribute("itemid")!;
    }

    return result;
  }

  override findChildElements() {
    return getChildContextElements(this.root.element, "itemtype");
  }

  override createChildAdapter(element: Element) {
    return new MicrodataAdapter(element, element.getAttribute("itemtype")!);
  }

  static getPropertyValue(element: Element) {
    if (element.hasAttribute("itemscope")) {
      return undefined;
    } else if (element.tagName.toLowerCase() === "meta") {
      return element.getAttribute("content")?.trim();
    } else if (
      ["audio", "embed", "iframe", "img", "source", "track", "video"].includes(
        element.tagName.toLowerCase()
      ) ||
      ["a", "area", "link"].includes(element.tagName.toLowerCase())
    ) {
      return element.getAttribute("src") || element.getAttribute("href") || "";
    } else if (element.tagName.toLowerCase() === "object") {
      return element.getAttribute("data") || "";
    } else if (
      element.tagName.toLowerCase() === "data" ||
      element.tagName.toLowerCase() === "meter"
    ) {
      return element.getAttribute("value") || "";
    } else if (element.tagName.toLowerCase() === "time") {
      return element.getAttribute("datetime") || "";
    } else if (element.hasAttribute("content")) {
      return element.getAttribute("content")?.trim();
    } else {
      return element.textContent?.trim();
    }
  }
}
