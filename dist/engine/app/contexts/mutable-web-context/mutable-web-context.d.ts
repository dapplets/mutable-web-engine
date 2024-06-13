/// <reference types="react" />
import { AppMetadata, AppWithSettings, MutationWithSettings } from '../../../providers/provider';
import { Engine } from '../../../engine';
export type MutableWebContextState = {
    engine: Engine;
    mutations: MutationWithSettings[];
    allApps: AppMetadata[];
    mutationApps: AppWithSettings[];
    selectedMutation: MutationWithSettings | null;
    isLoading: boolean;
    favoriteMutationId: string | null;
    stopEngine: () => void;
    switchMutation: (mutationId: string) => void;
    setFavoriteMutation: (mutationId: string | null) => void;
    removeMutationFromRecents: (mutationId: string) => void;
    setMutations: React.Dispatch<React.SetStateAction<MutationWithSettings[]>>;
    setMutationApps: React.Dispatch<React.SetStateAction<AppWithSettings[]>>;
};
export declare const contextDefaultValues: MutableWebContextState;
export declare const MutableWebContext: import("react").Context<MutableWebContextState>;
//# sourceMappingURL=mutable-web-context.d.ts.map