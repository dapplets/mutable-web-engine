import { BosComponent } from "../../src/bos/bos-widget";
import {
    BosWidgetFactory,
    BosWidgetFactoryConfig,
  } from "../../src/bos/bos-widget-factory";
  
  const widgetConfig: BosWidgetFactoryConfig = {
    networkId: "exampleNetwork",
    selector: ".widget-container",
    tagName: "div",
  };
  
  // todo: dont work
  describe("Bos Widget", () => {
    let widget: any;
    let src: string;
    beforeEach(() => {
      widget = new BosComponent();
      src = "https://github.com/dapplets";
    });
  
    it("connected callback", () => {
      expect(widget.connectedCallback());
    });
  });
  