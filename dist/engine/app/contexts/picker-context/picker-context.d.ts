import { ReactElement } from 'react';
import { Target } from '../../services/target/target.entity';
import { IContextNode } from '../../../../core';
export type TLatchVariant = 'primary' | 'secondary';
export type PickerTask = {
    target?: Target | Target[];
    onClick?: (context: IContextNode) => void;
    onMouseEnter?: (context: IContextNode) => void;
    onMouseLeave?: (context: IContextNode) => void;
    LatchComponent?: React.FC<{
        context: IContextNode;
        variant: TLatchVariant;
        contextDimensions: {
            width: number;
            height: number;
        };
    }>;
    styles?: React.CSSProperties;
    highlightChildren?: boolean;
    children?: ReactElement | ReactElement[];
};
export type PickerContextState = {
    pickerTask: PickerTask | null;
    setPickerTask: (picker: PickerTask | null) => void;
};
export declare const contextDefaultValues: PickerContextState;
export declare const PickerContext: import("react").Context<PickerContextState>;
//# sourceMappingURL=picker-context.d.ts.map