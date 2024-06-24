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
    LatchComponent?: React.FC<{
        context: IContextNode;
        variant: 'primary' | 'secondary';
        contextDimensions: {
            width: number;
            height: number;
        };
    }>;
}
export declare const Highlighter: FC<IHighlighter>;
export {};
//# sourceMappingURL=index.d.ts.map