import {  jest } from "@jest/globals";
import { PureTreeBuilder } from "../src/core/tree/pure-tree/pure-tree-builder";
import { JsonParser } from "../src/core/parsers/json-parser";
import { configDynamicHtmlAdapter } from "./data/adapters/dynamic-html-adapter-constants";
type Constructor<T = object> = new (...args: any[]) => T;

function instantiateClassMock<T extends object>(
  Clazz: Constructor<T>,
  args?: any
): jest.Mocked<T> {
  return new Clazz(args) as jest.Mocked<T>;
}
const mockListeners = {
  handleContextStarted: jest.fn(() => undefined),
  handleContextChanged: jest.fn(() => undefined),
  handleContextFinished: jest.fn(() => undefined),
  handleInsPointStarted: jest.fn(() => undefined),
  handleInsPointFinished: jest.fn(() => undefined),
};
export const mockedTreeBuilder = instantiateClassMock(PureTreeBuilder, mockListeners);
export const mockedJsonParser = instantiateClassMock(JsonParser, configDynamicHtmlAdapter);