import { InsertionType } from "../../../src/core/adapters/interface";
import {
  BosParser,
  BosParserConfig,
} from "../../../src/core/parsers/bos-parser";
import { IParser } from "../../../src/core/parsers/interface";

const config: BosParserConfig = {
  namespace: "example",
  contexts: {
    main: {
      component: "MainComponent",
      props: {
        prop1: "value1",
        prop2: "value2",
      },
      insertionPoints: {
        beforeHeader: {
          component: "BeforeHeaderComponent",
          bosLayoutManager: "LayoutManagerA",
          insertionType: InsertionType.Before,
        },
        afterHeader: {
          component: "AfterHeaderComponent",
          bosLayoutManager: "LayoutManagerB",
          insertionType: InsertionType.Before,
        },
        content: {
          component: "ContentComponent",
          insertionType: InsertionType.After,
        },
      },
      children: ["header", "footer"],
    },
    header: {
      component: "HeaderComponent",
      props: {
        title: "Header Title",
      },
    },
    footer: {
      component: "FooterComponent",
      props: {
        text: "Footer Text",
      },
    },
  },
};

describe("bos parser", () => {
  let element: HTMLElement;

  let bosParser: IParser;

  beforeEach(() => {
    function createElementFromConfig(
      config: BosParserConfig,
      contextName: string
    ): HTMLElement {
      const contextConfig = config.contexts[contextName];
      const element = document.createElement("div");
      element.setAttribute("data-context-name", contextName);

      if (contextConfig && contextConfig.props) {
        for (const prop in contextConfig.props) {
          element.setAttribute(`data-prop-${prop}`, contextConfig.props[prop]);
        }
      }

      if (contextConfig && contextConfig.insertionPoints) {
        for (const insPointName in contextConfig.insertionPoints) {
          const insertionPointConfig =
            contextConfig.insertionPoints[insPointName];
          const insertionElement = createElementFromConfig(
            config,
            insPointName
          );
          insertionElement.setAttribute("data-insertion-point", insPointName);

          if (insertionPointConfig.component) {
            insertionElement.setAttribute(
              "data-component",
              insertionPointConfig.component
            );
          }

          if (insertionPointConfig.bosLayoutManager) {
            insertionElement.setAttribute(
              "data-bos-layout-manager",
              insertionPointConfig.bosLayoutManager
            );
          }

          if (insertionPointConfig.insertionType === InsertionType.Before) {
            element.insertBefore(insertionElement, element.firstChild);
          } else if (
            insertionPointConfig.insertionType === InsertionType.After
          ) {
            element.appendChild(insertionElement);
          }
        }
      }

      if (contextConfig && contextConfig.children) {
        contextConfig.children.forEach((childName) => {
          const childElement = createElementFromConfig(config, childName);
          element.appendChild(childElement);
        });
      }

      return element;
    }
    const mainElement = createElementFromConfig(config, "main");
    element = document.body.appendChild(mainElement);

    bosParser = new BosParser(config);
  });

  it("should return a parsed context", () => {
    expect(bosParser.parseContext(element, "root").id).toBe("root");
  });

  it("should return a child", () => {
    expect(bosParser.findChildElements(element, "header").length).toBe(0);
  });

  it("should find insertionPoint", () => {
    const targetElement = document.createElement("div");

    targetElement.innerHTML = `<div data-bos-layout-manager="LayoutManagerA" data-component="BeforeHeaderComponent" data-context-name="beforeHeader" data-insertion-point="beforeHeader" />`;
    expect(
      bosParser.findInsertionPoint(element, "main", "beforeHeader")
    ).toStrictEqual(targetElement.children[0]);
  });

  it("should return insertionPoints", () => {
    expect(
      bosParser.getInsertionPoints(element, "main").some((element) => {
        let target = "afterHeader";
        return target.includes(element.name);
      })
    ).toBe(true);
  });
});
