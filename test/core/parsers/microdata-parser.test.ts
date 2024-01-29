import { IParser } from "../../../src/core/parsers/interface";
import { MicrodataParser } from "../../../src/core/parsers/microdata-parser";

describe("microdata parser", () => {
  let element: HTMLElement;

  let microdataParser: IParser;

  beforeEach(() => {
    element = document.createElement("div");
    element.innerHTML = `  <div id="root">
    <div class="context1-selector" id='test' data-context="context1">
      <p data-prop1="value1" data-prop2="value2">Context 1 Content</p>
      <div itemtype="insertionPoint1" class="insertion-point-selector">
        Insertion Point 1 Content
      </div>
      <div itemprop="itemprop value">
      itemprop text
      </div>
      <div itemid="itemid value">itemid</div>
      <div itemtype="itemtype value">itemtype text</div>
    </div>
  </div>`;

    microdataParser = new MicrodataParser();
  });

  it("should return a parsed context", () => {
    expect(microdataParser.parseContext(element, "root")).toHaveProperty(
      "itemprop value"
    );
  });

  it("should return a child", () => {
    expect(
      microdataParser.findChildElements(element, "root").some((element) => {
        let target = "itemtype value";
        return target.includes(element.contextName);
      })
    ).toBe(true);
  });

  it("should find insertionPoint", () => {
    const findElement = microdataParser.findInsertionPoint(
      element,
      "root",
      "insertionPoint1"
    );

    expect(findElement?.getAttribute("itemtype")).toBe("insertionPoint1");
  });

  it("should get insertionPoint", () => {
    expect(
      microdataParser
        .getInsertionPoints(element, "itemtype value")
        .some((element) => {
          let target = "itemtype value";
          return target.includes(element.name);
        })
    ).toBe(true);
  });
});
