/// <reference types="react" />
import { Core, IContextNode, ParserConfig } from '../../../core';
export type MutableWebContextState = {
    core: Core | null;
    tree: IContextNode | null;
    attachParserConfig: (parserConfig: ParserConfig) => void;
    detachParserConfig: (parserId: string) => void;
};
export declare const contextDefaultValues: MutableWebContextState;
export declare const MutableWebContext: import("react").Context<MutableWebContextState>;
//# sourceMappingURL=mutable-web-context.d.ts.map