/// <reference types="react" />
import { IContextNode } from '../../../../core';
import { BosRedirectMap } from '../../services/dev-server-service';
import { Target } from '../../services/target/target.entity';
export type InjectableTarget = Target & {
    injectTo: string;
};
export type PickerTask = {
    target?: Target | Target[];
    onClick?: ((context: IContextNode | null) => void) | null;
    onMouseEnter?: ((context: IContextNode | null) => void) | null;
    onMouseLeave?: ((context: IContextNode | null) => void) | null;
    styles?: React.CSSProperties;
    highlightChildren?: boolean;
    transparencyCondition?: (currentContext: IContextNode) => boolean;
};
export type EngineContextState = {
    viewportRef: React.RefObject<HTMLDivElement>;
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