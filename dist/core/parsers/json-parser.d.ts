import { InsertionType } from '../adapters/interface';
import { IParser, InsertionPoint } from './interface';
export type JsonParserConfig = {
    contexts: {
        [name: string]: {
            selector?: string;
            props?: {
                [prop: string]: string;
            };
            insertionPoints?: {
                [insPointName: string]: string | {
                    selector?: string;
                    bosLayoutManager?: string;
                    insertionType?: InsertionType;
                };
            };
            children?: string[];
        };
    };
};
export declare class JsonParser implements IParser {
    protected config: JsonParserConfig;
    constructor(config: JsonParserConfig);
    parseContext(element: Element, contextName: string): any;
    findChildElements(element: Element, contextName: string): {
        element: Element;
        contextName: string;
    }[];
    findInsertionPoint(element: Element, contextName: string, insertionPoint: string): Element | null;
    getInsertionPoints(_: Element, contextName: string): InsertionPoint[];
}
//# sourceMappingURL=json-parser.d.ts.map