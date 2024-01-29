import { InsertionType } from "../../../src/core/adapters/interface";
import { IParser } from "../../../src/core/parsers/interface";
import { NaiveBosParser } from "../../../src/core/parsers/naive-bos-parser";
import { IContextNode } from "../../../src/core/tree/types";
const element = document.createElement("div");
element.innerHTML = `<div id="root" data-props="data-props-test" data-value="" data-component="near/widget/Posts.Compose" class="sc-gyoxqN crCpYL">
<textarea placeholder="What's happening?" data-component="near/widget/Posts.Compose"></textarea>

<p data-component="near/widget/Posts.Compose" class="sc-jWhMlA gLrVan">
  <a href="https://dapplets.org/ns/json/some-web-site" target="_blank" data-component="before">
    Markdown
  </a>
  is supported
</p>
</div>`;
describe("naive bos parser", () => {
  // let element: HTMLElement;

  let naiveBosParser: IParser;

  beforeEach(() => {
    naiveBosParser = new NaiveBosParser();
  });

  // todo: how check?
  it("should return a parsed context", () => {
    expect(naiveBosParser.parseContext(element, "data-props"));
  });

  it("should return a child", () => {
    expect(naiveBosParser.findChildElements(element, "root").length).toBe(1);
  });

  it("should find insertionPoint", () => {
    const findElement = naiveBosParser.findInsertionPoint(
      element,
      "root",
      "before"
    );

    expect(findElement?.getAttribute("href")).toBe(
      "https://dapplets.org/ns/json/some-web-site"
    );
  });

  it("should return insertionPoints", () => {
    expect(
      naiveBosParser.getInsertionPoints(element, "root").some((element) => {
        let target = "near--Posts.Compose";
        return target.includes(element.name);
      })
    ).toBe(true);
  });
});
