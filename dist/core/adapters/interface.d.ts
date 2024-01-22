import { InsertionPoint } from "../parsers/interface";
import { IContextNode } from "../tree/types";
export declare enum InsertionType {
    Before = "before",
    After = "after",
    Begin = "begin",
    End = "end"
}
export interface IAdapter {
    namespace: string;
    context: IContextNode;
    start(): void;
    stop(): void;
    injectElement(element: Element, context: IContextNode, insertionPoint: string, insertionType: InsertionType): void;
    getInsertionPoints(context: IContextNode): InsertionPoint[];
}
//# sourceMappingURL=interface.d.ts.map