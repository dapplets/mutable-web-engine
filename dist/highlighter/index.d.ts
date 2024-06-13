import React, { FC } from 'react';
import { IContextNode } from '../core';
interface IContextReactangle {
    context: IContextNode;
    styles?: React.CSSProperties;
    onClick?: () => void;
    contextDepth?: number;
}
export declare const ContextReactangle: FC<IContextReactangle>;
export {};
//# sourceMappingURL=index.d.ts.map