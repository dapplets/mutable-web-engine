"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bosLoaderUrl = exports.DappletsEngineNs = exports.getNearConfig = exports.NearConfigs = void 0;
exports.NearConfigs = {
    mainnet: {
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org',
        contractName: 'social.dapplets.near',
        walletUrl: 'https://app.mynearwallet.com',
        defaultMutationId: 'bos.dapplets.near/mutation/Sandbox',
        defaultLayoutManager: 'bos.dapplets.near/widget/DefaultLayoutManager',
    },
    testnet: {
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        contractName: 'social.dapplets.testnet',
        walletUrl: 'https://testnet.mynearwallet.com',
        defaultMutationId: 'bos.dapplets.testnet/mutation/Sandbox',
        defaultLayoutManager: 'bos.dapplets.testnet/widget/DefaultLayoutManager',
    },
};
const getNearConfig = (networkId) => {
    const config = exports.NearConfigs[networkId];
    if (!config)
        throw new Error(`Unknown networkId ${networkId}`);
    return config;
};
exports.getNearConfig = getNearConfig;
exports.DappletsEngineNs = 'engine';
exports.bosLoaderUrl = 'http://127.0.0.1:3030/';
