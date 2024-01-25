import { InsertionType } from "../../../src/core/adapters/interface";
import { IParser } from "../../../src/core/parsers/interface";
import { MicrodataParser } from "../../../src/core/parsers/microdata-parser";
import { IContextNode } from "../../../src/core/tree/types";

describe("naive bos parser", () => {
  let element: HTMLElement;

  let naiveBosParser: IParser;

  beforeEach(() => {
    element = document.createElement("div");
    element.outerHTML = `<div id="root" data-value="" data-component="near/widget/Posts.Compose" class="sc-gyoxqN crCpYL">
    <textarea placeholder="What's happening?" data-component="near/widget/Posts.Compose"></textarea>

    <p data-component="near/widget/Posts.Compose" class="sc-jWhMlA gLrVan">
      <a href="https://www.markdownguide.org/basic-syntax/" target="_blank" data-component="before">
        Markdown
      </a>
      is supported
    </p>
  </div>`;

    naiveBosParser = new MicrodataParser();
  });

  it("should return a parsed context", () => {
    expect(naiveBosParser.parseContext(element, "root"));
  });

  it("should return a child", () => {
    expect(naiveBosParser.findChildElements(element, "root"));
  });

  it("should find insertionPoint", () => {
    expect(naiveBosParser.findInsertionPoint(element, "root", "before"));
  });

  it("should return insertionPoints", () => {
    expect(naiveBosParser.getInsertionPoints(element, "root"));
  });
});
