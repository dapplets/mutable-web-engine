import { InsertionPointWithElement } from './pure-tree/pure-context-node';
export type ParsedContext = {
    [key: string]: any;
};
export interface IContextNode {
    id: string | null;
    contextType: string;
    namespace: string;
    parentNode: IContextNode | null;
    element: HTMLElement | null;
    parsedContext: ParsedContext;
    insPoints: InsertionPointWithElement[];
    children: IContextNode[];
    removeChild(child: IContextNode): void;
    appendChild(child: IContextNode): void;
}
export interface ITreeBuilder {
    root: IContextNode;
    appendChild(parent: IContextNode, child: IContextNode): void;
    removeChild(parent: IContextNode, child: IContextNode): void;
    updateParsedContext(context: IContextNode, parsedContext: any): void;
    updateInsertionPoints(context: IContextNode, insPoints: InsertionPointWithElement[]): void;
    createNode(namespace: string | null, contextType: string, parsedContext?: any, insPoints?: InsertionPointWithElement[], element?: HTMLElement): IContextNode;
}
//# sourceMappingURL=types.d.ts.map