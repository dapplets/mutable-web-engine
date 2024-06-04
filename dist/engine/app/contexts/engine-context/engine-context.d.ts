/// <reference types="react" />
import { Engine } from '../../../engine';
import { InjectableTarget } from '../../../providers/provider';
import { IContextNode } from '../../../../core';
export type EngineContextState = {
    engine: Engine;
    portals: Map<React.FC<unknown>, InjectableTarget>;
    addPortal: <T>(target: InjectableTarget, cmp: React.FC<T>) => void;
    removePortal: <T>(cmp: React.FC<T>) => void;
    pickerCallback: ((context: IContextNode | null) => void) | null;
    setPickerCallback: (callback: ((context: IContextNode | null) => void) | null) => void;
};
export declare const contextDefaultValues: EngineContextState;
export declare const EngineContext: import("react").Context<EngineContextState>;
//# sourceMappingURL=engine-context.d.ts.map