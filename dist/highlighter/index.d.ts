import React, { FC } from 'react';
import { IContextNode } from '../core';
interface IHighlighter {
    focusedContext: IContextNode | null;
    context: IContextNode;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    styles?: React.CSSProperties;
    onClick?: (() => void) | null;
    highlightChildren?: boolean;
    variant?: 'primary' | 'secondary';
}
export declare const Highlighter: FC<IHighlighter>;
export {};
//# sourceMappingURL=index.d.ts.map