/// <reference types="react" />
import { Engine } from '../../../engine';
import { ContextTarget, InjectableTarget } from '../../../providers/provider';
import { IContextNode } from '../../../../core';
import { BosRedirectMap } from '../../services/dev-server-service';
export type PickerTask = {
    callback: ((context: IContextNode | null) => void) | null;
    target: ContextTarget;
};
export type EngineContextState = {
    engine: Engine;
    portals: Map<string, {
        component: React.FC<unknown>;
        target: InjectableTarget;
    }>;
    addPortal: <T>(key: string, target: InjectableTarget, cmp: React.FC<T>) => void;
    removePortal: <T>(key: string) => void;
    pickerTask: PickerTask | null;
    setPickerTask: (picker: PickerTask | null) => void;
    redirectMap: BosRedirectMap | null;
    enableDevMode: () => void;
    disableDevMode: () => void;
};
export declare const contextDefaultValues: EngineContextState;
export declare const EngineContext: import("react").Context<EngineContextState>;
//# sourceMappingURL=engine-context.d.ts.map