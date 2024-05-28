import { AppWithSettings, Mutation } from '../../providers/provider';
import { FC } from 'react';
import { IWalletConnect } from './Profile';
interface IMutationAppsControl {
    enableApp: (appId: string) => Promise<void>;
    disableApp: (appId: string) => Promise<void>;
    isLoading: boolean;
}
interface SidePanelProps extends IMutationAppsControl, IWalletConnect {
    baseMutation: Mutation | null;
    mutationApps: AppWithSettings[];
}
export declare const MiniOverlay: FC<SidePanelProps>;
export default MiniOverlay;
//# sourceMappingURL=index.d.ts.map