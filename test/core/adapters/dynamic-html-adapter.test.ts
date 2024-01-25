import { DynamicHtmlAdapter } from "../../../src/core/adapters/dynamic-html-adapter";
import { IAdapter, InsertionType } from "../../../src/core/adapters/interface";
import { IParser } from "../../../src/core/parsers/interface";
import { JsonParser } from "../../../src/core/parsers/json-parser";
import { IContextNode } from "../../../src/core/tree/types";

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

// todo: dont work
describe("dynamic-html-adapter", () => {
  let element: HTMLElement;
  let ns: string;
  let adapter: IAdapter;
  let ctx: IContextNode;

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

    ns = "https://dapplets.org/ns/json/some-web-site";


    ns = "https://dapplets.org/ns/json/some-web-site";
  
  });

  it("", () => {

  });


});
