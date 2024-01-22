import { IAdapter } from "./core/adapters/interface";
import { BosParserConfig } from "./core/parsers/bos-parser";
import { ParserConfig } from "./core/parsers/json-parser";
import { WalletSelector } from "@near-wallet-selector/core";
import { IContextListener, IContextNode, ITreeBuilder } from "./core/tree/types";
export declare enum AdapterType {
    Bos = "bos",
    Microdata = "microdata",
    Json = "json"
}
export type EngineConfig = {
    networkId: string;
    selector: WalletSelector;
};
export declare class Engine implements IContextListener {
    #private;
    private config;
    adapters: Set<IAdapter>;
    treeBuilder: ITreeBuilder;
    started: boolean;
    constructor(config: EngineConfig);
    handleContextStarted(context: IContextNode): Promise<void>;
    handleContextChanged(context: IContextNode, oldParsedContext: any): void;
    handleContextFinished(context: IContextNode): void;
    start(): Promise<void>;
    stop(): void;
    registerAdapter(adapter: IAdapter): void;
    unregisterAdapter(adapter: IAdapter): void;
    createAdapter(type: AdapterType.Microdata): IAdapter;
    createAdapter(type: AdapterType.Bos, config: BosParserConfig): IAdapter;
    createAdapter(type: AdapterType.Json, config: ParserConfig): IAdapter;
}
//# sourceMappingURL=engine.d.ts.map