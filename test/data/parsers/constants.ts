import { InsertionType } from "../../../src/core/adapters/interface";

export const jsonParserDataHtml = document.createElement("div");
jsonParserDataHtml.innerHTML = ` 
<div id="root">

<div data-testid='UserName'>
<span>2</span>
</div> 

<div aria-label='Account menu'>
<img alt="Test-fullname"/>
</div>

<div class="context1-selector" data-testid="post"  id='test-post' data-context="context1">
 <p data-prop1="value1" data-prop2="value2" data-testid='tweetText'>Context 1 Content</p>
 <div data-insertion-point="insertionPoint1" class="insertion-point-selector">
   Insertion Point 1 Content
 </div>
 <div data-insertion-point="insertionPoint2">
   Insertion Point 2 Content
 </div>
 <div data-child="child1">Child 1 Content</div>
 <div data-child="child2">Child 2 Content</div>
</div>
<div class="context1-selector" data-testid="post" id='test-post' data-context="context1">
<p data-prop1="value1" data-prop2="value2" data-testid='tweetText'>Context 1 Content</p>
<div data-insertion-point="insertionPoint1" class="insertion-point-selector2">
 Insertion Point 1 Content
</div>
<div data-insertion-point="insertionPoint2">
 Insertion Point 2 Content
</div>
<div data-child="child1">Child 1 Content</div>
<div data-child="child2">Child 2 Content</div>
</div>

<div class="context2-selector" data-testid="profile" id='test-profile' data-context="context2">
<p data-prop2="value2"  data-testid='tweetProfile'>Context 2 Content</p>
<div data-insertion-point="insertionPoint3" class="insertion-point-selector-2">
 Insertion Point 3 Content
</div>
<div data-insertion-point="insertionPoint4">
 Insertion Point 4 Content
</div>
<div data-child="child3">Child 3 Content</div>
<div data-child="child4">Child 4 Content</div>
</div>

<div class="context2-selector" data-testid="profile" id='test-profile' data-context="context2">
<p data-prop2="value2"  data-testid='tweetProfile'>Context 2 Content</p>
<div data-insertion-point="insertionPoint3" class="insertion-point-selector-3">
Insertion Point 3 Content
</div>
<div data-insertion-point="insertionPoint4">
Insertion Point 4 Content
</div>
<div data-child="child3">Child 3 Content</div>
<div data-child="child4">Child 4 Content</div>
</div>

</div>`;

export const configJsonParser = {
  namespace: "sampleNamespace",
  contexts: {
    root: {
      selector: "div[id='root']",
      props: {
        id: "string('root')",
        username: "number(.//*[@data-testid='UserName']//span[1])",
        fullname: "string(.//*[@aria-label='Account menu']//img/@alt)",
        img: '[data-testid="nothingImg"]',
      },
      children: ["post", "profile", "panel"],
    },
    post: {
      // ToDo: specify selector, props
      selector: "div[data-testid='profile']",
      props: {
        id: "string(.//img/@id)",
        text: "string(.//*[@data-testid='tweetText'])",
      },
      insertionPoints: {
        text: {
          selector: ".insertion-point-selector",
          bosLayoutManager: "layoutManager1",
          insertionType: InsertionType.After,
        },
      },
    },
    profile: {
      // ToDo: specify this context
      selector: "div[data-testid=profile]",
      props: {
        id: "string(.//img/@id)",
        text: "string(.//*[@data-testid='tweetProfile'])",
      },
      insertionPoints: {
        avatar: {
          selector: ".insertion-point-selector-2",
          bosLayoutManager: "layoutManager2",
          insertionType: InsertionType.After,
        },
        text: "data-insertion-point",
      },
    },
    panel: {
      selector: "div[data-testid=panel]",
      props: {
        id: "string(.//img/@id)",
        text: "string(.//*[@data-testid='tweetProfile'])",
      },
      insertionPoints: {
        avatar: {
          selector: ".class-null",
          bosLayoutManager: "layoutManager1",
          insertionType: InsertionType.After,
        },
        text: "data-null",
      },
    },
  },
};
