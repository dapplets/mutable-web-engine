import { IContextNode, Core } from '../core';
import { AppMetadata, AppWithSettings, Mutation, MutationWithSettings } from './providers/provider';
import { WalletSelector } from '@near-wallet-selector/core';
import { MutationManager } from './mutation-manager';
import { IStorage } from './storage/storage';
export type EngineConfig = {
    networkId: string;
    gatewayId: string;
    selector: WalletSelector;
    storage?: IStorage;
    bosElementName?: string;
    bosElementStyleSrc?: string;
};
export declare let engineSingleton: Engine | null;
export declare class Engine {
    #private;
    private config;
    mutationManager: MutationManager;
    started: boolean;
    core: Core;
    constructor(config: EngineConfig);
    handleContextStarted({ context }: {
        context: IContextNode;
    }): Promise<void>;
    getLastUsedMutation: () => Promise<string | null>;
    start(mutationId?: string | null): Promise<void>;
    stop(): void;
    getMutations(): Promise<MutationWithSettings[]>;
    switchMutation(mutationId: string): Promise<void>;
    getCurrentMutation(): Promise<MutationWithSettings | null>;
    setFavoriteMutation(mutationId: string | null): Promise<void>;
    getFavoriteMutation(): Promise<string | null>;
    removeMutationFromRecents(mutationId: string): Promise<void>;
    getApplications(): Promise<AppMetadata[]>;
    createMutation(mutation: Mutation): Promise<MutationWithSettings>;
    editMutation(mutation: Mutation): Promise<MutationWithSettings>;
    getAppsFromMutation(mutationId: string): Promise<AppWithSettings[]>;
    enableApp(appId: string): Promise<void>;
    disableApp(appId: string): Promise<void>;
    private _updateRootContext;
    private _populateMutationWithSettings;
    private _populateAppWithSettings;
    private _startApp;
    private _stopApp;
    private _traverseContextTree;
}
//# sourceMappingURL=engine.d.ts.map