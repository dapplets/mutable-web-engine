import { IParser } from "../../../src/core/parsers/interface";
import { JsonParser } from "../../../src/core/parsers/json-parser";
import { describe, expect, it } from "@jest/globals";
import {
  configJsonParser,
  jsonParserDataHtml,
} from "../../data/parsers/constants";

describe("JSON parser", () => {
  let element: HTMLElement;

  let jsonParser: IParser;

  beforeEach(() => {
    element = jsonParserDataHtml;

    jsonParser = new JsonParser(configJsonParser);
  });

  it("should return a parsed context", () => {
    // Arrange
    const expected = {
      id: "root",
      username: "2", // ToDo: use 2 instead of "2"
      fullname: "Test-fullname",
      img: null,
    };

    // Act
    const actual = jsonParser.parseContext(element, "root");

    // Assert
    expect(actual).toStrictEqual(expected);
  });

  // ToDo: use AAA pattern and `expected` and `actual` variable names as written above
  it("should find insertionPoint", () => {
    // ToDo: where assertion is?

    const checkContext = jsonParser.findInsertionPoint(element, "post", "text");

    // ToDo: move null checking to a separate test in this file
    const checkContextNull = jsonParser.findInsertionPoint(
      element,
      "panel",
      "avatar"
    );
    const testElement = element.getElementsByClassName(
      "insertion-point-selector"
    )[0];
    expect(checkContext).toStrictEqual(testElement);
    expect(checkContextNull).toStrictEqual(null);
  });

  it("should return insertionPoints", () => {
    // ToDo: check that all insertion points recognized correctly
    const elementPost = document.createElement("div");
    elementPost.innerHTML = `<div class="context1-selector" data-testid="post" id='test-post' data-context="context1">
<p data-prop1="value1" data-prop2="value2" data-testid='tweetText'>Context 1 Content</p>
<div data-insertion-point="insertionPoint1" class="insertion-point-selector">
  Insertion Point 1 Content
</div>
<div data-insertion-point="insertionPoint2">
  Insertion Point 2 Content
</div>
<div data-child="child1">Child 1 Content</div>
<div data-child="child2">Child 2 Content</div>
</div>`;

    // ToDo: split to separate tests
    const elementProfile = document.createElement("div");
    elementProfile.innerHTML = `<div class="context2-selector" data-testid="profile" id='test-profile' data-context="context2">
<p data-prop2="value2"  data-testid='tweetProfile'>Context 2 Content</p>
<div data-insertion-point="insertionPoint3" class="insertion-point-selector-3">
Insertion Point 3 Content
</div>
<div data-insertion-point="insertionPoint4">
Insertion Point 4 Content
</div>
<div data-child="child3">Child 3 Content</div>
<div data-child="child4">Child 4 Content</div>
</div>`;
    const checkContextPost = jsonParser.getInsertionPoints(
      elementPost.children[0],
      "post"
    );
    const checkContextProfile = jsonParser.getInsertionPoints(
      elementProfile.children[0],
      "profile"
    );

    const testDataPost = [
      {
        name: "text",
        insertionType: "after",
        bosLayoutManager: "layoutManager1",
      },
    ];

    const testDataProfile = [
      {
        name: "avatar",
        insertionType: "after",
        bosLayoutManager: "layoutManager2",
      },
      {
        name: "text",
        insertionType: undefined,
        bosLayoutManager: undefined,
      },
    ];
    expect(checkContextPost).toStrictEqual(testDataPost);
    expect(checkContextProfile).toStrictEqual(testDataProfile);
  });

  it("find child elements", () => {
    // ToDo: compare elements with toStrictEqual
    expect(jsonParser.findChildElements(element, "root").length).toBe(4);
  });
});
