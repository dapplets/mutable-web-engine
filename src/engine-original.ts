/////// JSON ADAPTER SPECIFIC LOGIC ///////

type AdapterConfig = {
  context: {
    selector: string;
    type: string;
    props: {
      [key: string]: string;
    };
  };
  children?: AdapterConfig[];
};

const query = (cssOrXPath: string, element: Element) => {
  try {
    const result = element.querySelector(cssOrXPath);
    if (result) return result.textContent;
  } catch (_) {}

  try {
    // ToDo: replace with document.createExpression ?
    const result = element.ownerDocument.evaluate(cssOrXPath, element, null, 0);

    switch (result.resultType) {
      case XPathResult.NUMBER_TYPE:
        return result.numberValue;
      case XPathResult.STRING_TYPE:
        return result.stringValue;
      case XPathResult.BOOLEAN_TYPE:
        return result.booleanValue;
      default:
        return null; // ToDo: or undefined?
    }
  } catch (_) {
    console.error(_);
  }

  return null;
};

export class JsonContextNode {
  type: string;
  value: Record<string, string | number | boolean | null> = {};
  children: JsonContextNode[] = [];
  parent: JsonContextNode | null = null;
  element: Element;

  #mutationObserver: MutationObserver;
  #config: AdapterConfig;

  constructor(config: AdapterConfig, element: Element) {
    this.element = element;
    this.#config = config;
    this.type = config.context.type;
    this.#mutationObserver = new MutationObserver(this.onMutation.bind(this));
    this.#mutationObserver.observe(element, {
      attributes: true,
      childList: true,
      subtree: true,
    });
    this.onMutation([]); // ToDo: refactor
  }

  addChild(child: JsonContextNode) {
    child.parent = this;
    this.children.push(child);
  }

  removeChild(child: JsonContextNode) {
    this.children.splice(this.children.indexOf(child), 1);
  }

  onMutation(mutations: MutationRecord[]) {
    // update props (parse)
    for (const prop in this.#config.context.props) {
      const cssOrXpathQuery = this.#config.context.props[prop];
      this.value[prop] = query(cssOrXpathQuery, this.element);
    }

    // update children contexts
    for (const childConfig of this.#config.children ?? []) {
      const found = Array.from(
        this.element.querySelectorAll(childConfig.context.selector)
      );

      for (const el of found) {
        if (!this.children.some((ctx) => ctx.element === el)) {
          const node = new JsonContextNode(childConfig, el);
          this.addChild(node);
        }
      }

      // remove children that are no longer in the DOM
      for (const child of this.children) {
        if (child.type !== childConfig.context.type) {
          continue;
        }

        if (!found.some((el) => el === child.element)) {
          this.removeChild(child);
        }
      }
    }
  }
}

/////// BOS SPECIFIC LOGIC ///////

function getClosestBosChildrenByAttribute(element: Element, attribute: string) {
  const result: Element[] = [];

  for (const child of element.children) {
    if (child instanceof HTMLElement) {
      if (child.hasAttribute(attribute)) {
        result.push(child);
      } else {
        result.push(...getClosestBosChildrenByAttribute(child, attribute));
      }
    }
  }

  return result;
}

export class BosContextNode {
  type: string;
  value: Record<string, string | number | boolean | null> = {};
  children: BosContextNode[] = [];
  parent: BosContextNode | null = null;
  element: Element;

  #mutationObserver: MutationObserver;

  constructor(element: Element, type = "root") {
    this.element = element;
    this.type = type;
    this.#mutationObserver = new MutationObserver(this.onMutation.bind(this));
    this.#mutationObserver.observe(element, {
      attributes: true,
      childList: true,
      subtree: true,
    });
    this.onMutation([]); // ToDo: refactor
  }

  addChild(child: BosContextNode) {
    child.parent = this;
    this.children.push(child);
  }

  removeChild(child: BosContextNode) {
    this.children.splice(this.children.indexOf(child), 1);
  }

  onMutation(mutations: MutationRecord[]) {
    // update props (parse)
    this.value = JSON.parse(
      this.element.getAttribute("data-component-props") ?? "{}"
    );

    // update children contexts
    const found = getClosestBosChildrenByAttribute(this.element, "data-component");

    for (const el of found) {
      if (!this.children.some((ctx) => ctx.element === el)) {
        const node = new BosContextNode(el, el.getAttribute("data-component")!);
        this.addChild(node);
      }
    }

    // remove children that are no longer in the DOM
    for (const child of this.children) {
      if (!found.some((el) => el === child.element)) {
        this.removeChild(child);
      }
    }
  }
}

/////// MICRODATA SPECIFIC LOGIC ///////

export class MicrodataContextNode {
  type: string;
  value: Record<string, string | number | boolean | null> = {};
  children: MicrodataContextNode[] = [];
  parent: MicrodataContextNode | null = null;
  element: Element;

  #mutationObserver: MutationObserver;

  constructor(element: Element, type = "root") {
    this.element = element;
    this.type = type;
    this.#mutationObserver = new MutationObserver(this.onMutation.bind(this));
    this.#mutationObserver.observe(element, {
      attributes: true,
      childList: true,
      subtree: true,
    });
    this.onMutation([]); // ToDo: refactor
  }

  addChild(child: MicrodataContextNode) {
    child.parent = this;
    this.children.push(child);
  }

  removeChild(child: MicrodataContextNode) {
    this.children.splice(this.children.indexOf(child), 1);
  }

  onMutation(mutations: MutationRecord[]) {
    // update props (parse)
    // this.value = JSON.parse(
    //   this.element.getAttribute("data-component-props") ?? "{}"
    // );

    // update children contexts
    const found = getClosestBosChildrenByAttribute(this.element, "itemtype");

    for (const el of found) {
      if (!this.children.some((ctx) => ctx.element === el)) {
        const node = new MicrodataContextNode(el, el.getAttribute("itemtype")!);
        this.addChild(node);
      }
    }

    // remove children that are no longer in the DOM
    for (const child of this.children) {
      if (!found.some((el) => el === child.element)) {
        this.removeChild(child);
      }
    }
  }
}
