import { InsertionPoint } from '../../parsers/interface';
import { IContextNode } from '../types';
export type InsertionPointWithElement = InsertionPoint & {
    element: HTMLElement;
};
export declare class PureContextNode implements IContextNode {
    id: string | null;
    contextType: string;
    namespace: string;
    parentNode: IContextNode | null;
    parsedContext: any;
    children: IContextNode[];
    insPoints: InsertionPointWithElement[];
    element: HTMLElement | null;
    constructor(namespace: string, contextType: string, parsedContext?: any, insPoints?: InsertionPointWithElement[], element?: HTMLElement | null);
    removeChild(child: IContextNode): void;
    appendChild(child: IContextNode): void;
}
//# sourceMappingURL=pure-context-node.d.ts.map