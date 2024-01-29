import { InsertionType } from "../../../src/core/adapters/interface";
import { IParser } from "../../../src/core/parsers/interface";
import { JsonParser } from "../../../src/core/parsers/json-parser";

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
      // ToDo: specify selector, props
      insertionPoints: {
        insertionPoint1: {
          selector: ".insertion-point-selector",
          bosLayoutManager: "layoutManager1",
          insertionType: InsertionType.After,
        },
        insertionPoint2: "data-insertion-point",
      },
    },
    profile: {
      // ToDo: specify this context
    },
  },
};

describe("JSON parser", () => {
  let element: HTMLElement;

  let jsonParser: IParser;

  beforeEach(() => {
    element = document.createElement("div");
    element.innerHTML = `  <div id="root">
    <div class="context1-selector" id='test' data-context="context1">
      <p data-prop1="value1" data-prop2="value2">Context 1 Content</p>
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

    jsonParser = new JsonParser(config);
  });

  it("should return a parsed context", () => {
    // ToDo: add more props with different data types (boolean, string, number)
    expect(jsonParser.parseContext(element, "root").id).toBe("root");
  });

  it("should return a child", () => {
    // ToDo: should not be 0 posts
    expect(jsonParser.findChildElements(element, "post").length).toBe(0);
  });

  it("should find insertionPoint", () => {
    // ToDo: where assertion is?
    expect(jsonParser.findInsertionPoint(element, "root", "insertionPoint2"));
  });

  it("should return insertionPoints", () => {
    // ToDo: check that all insertion points recognized correctly
    expect(
      jsonParser.getInsertionPoints(element, "root").some((element) => {
        let target = "insertionPoint1";
        return target.includes(element.name);
      })
    ).toBe(true);
  });
});
