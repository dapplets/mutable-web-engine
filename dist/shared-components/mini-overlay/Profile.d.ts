import { FC } from 'react';
export interface IWalletConnect {
    nearNetwork: 'mainnet' | 'testnet';
    connectWallet: () => Promise<void>;
    disconnectWallet: () => Promise<void>;
}
export interface IProfileProps extends IWalletConnect {
    accountId: string | null;
    closeProfile: () => void;
}
declare const Profile: FC<IProfileProps>;
export default Profile;
//# sourceMappingURL=Profile.d.ts.map