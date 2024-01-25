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
describe("Bos Widget Factory", () => {
  let widget: any;
  let src: string;
  beforeEach(() => {
    widget = new BosWidgetFactory(widgetConfig);
    src = "https://github.com/dapplets";
  });

  it("create widget", () => {
    expect(widget.createWidget(src));
  });
});
