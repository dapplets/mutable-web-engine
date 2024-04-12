import { WalletSelector } from '@near-wallet-selector/core'
import * as nearAPI from 'near-api-js'
import { QueryResponseKind } from 'near-api-js/lib/providers/provider'
import { KeyStorage } from './key-storage'
import { JsonStorage } from '../storage/json-storage'
import Big from 'big.js'
import { NearConfig } from '../constants'

export const DefaultGas = '30000000000000' // 30 TGas
export const TGas = Big(10).pow(12)

/**
 * NearSigner is a wrapper around near-api-js JsonRpcProvider and WalletSelector
 * that provides a simple interface for calling and viewing contract methods.
 *
 * Methods view and call are based on near-social-vm
 * Repo: https://github.com/dapplets/near-social-vm/blob/2ba7b77ada4c8e898cc5599f7000b4e0f30991a4/src/lib/data/near.js
 */
export class NearSigner {
  readonly provider: nearAPI.providers.JsonRpcProvider

  constructor(
    private _selector: WalletSelector,
    private _jsonStorage: JsonStorage,
    private _nearConfig: NearConfig
  ) {
    this.provider = new nearAPI.providers.JsonRpcProvider({
      url: _nearConfig.nodeUrl,
    })
  }

  async getAccountId(): Promise<string | null> {
    const wallet = await (await this._selector).wallet()
    const accounts = await wallet.getAccounts()
    return accounts[0]?.accountId ?? null
  }

  async view(contractName: string, methodName: string, args: any): Promise<any> {
    args = args || {}
    const result = (await this.provider.query({
      request_type: 'call_function',
      account_id: contractName,
      method_name: methodName,
      args_base64: btoa(JSON.stringify(args)),
      block_id: undefined,
      finality: 'final',
    })) as QueryResponseKind & { result: number[] }

    return (
      result.result &&
      result.result.length > 0 &&
      JSON.parse(new TextDecoder().decode(new Uint8Array(result.result)))
    )
  }

  async call(contractName: string, methodName: string, args: any, gas?: string, deposit?: string) {
    if (contractName === this._nearConfig.contractName) {
      const contractWalletConnection = await this._createWalletConnectionForContract(contractName)
      if (contractWalletConnection.isSignedIn()) {
        const functionAccessKeyAccount = contractWalletConnection.account()

        return functionAccessKeyAccount.functionCall({
          contractId: contractName,
          methodName,
          args,
          // ToDo
          // @ts-ignore
          gas,
        })
      } else {
        return this._signInAndSetPendingTransaction(contractName, methodName, args, gas, deposit)
      }
    }

    try {
      const wallet = await (await this._selector).wallet()

      return await wallet.signAndSendTransaction({
        receiverId: contractName,
        actions: [
          {
            type: 'FunctionCall',
            params: {
              methodName,
              args,
              gas: gas ?? DefaultGas,
              deposit: deposit ?? '0',
            },
          },
        ],
      })
    } catch (e) {
      // const msg = e.toString();
      // if (msg.indexOf("does not have enough balance") !== -1) {
      //   return await refreshAllowanceObj.refreshAllowance();
      // }
      throw e
    }
  }

  private _getKeyStoreForContract(contractId: string) {
    return new KeyStorage(this._jsonStorage, `${contractId}:keystore:`)
  }

  private async _createWalletConnectionForContract(contractId: string) {
    const keyStore = this._getKeyStoreForContract(contractId)

    const near = await nearAPI.connect({
      keyStore,
      // walletUrl: wallet.metadata.walletUrl,
      networkId: 'mainnet', // ToDo: parametrize
      nodeUrl: this.provider.connection.url,
      headers: {},
    })

    return new nearAPI.WalletConnection(near, contractId)
  }

  private async _signInAndSetPendingTransaction(
    contractName: string,
    methodName: string,
    args: any,
    gas?: string,
    deposit?: string
  ) {
    const keyPair = nearAPI.utils.KeyPair.fromRandom('ed25519')
    const accessKey = nearAPI.transactions.functionCallAccessKey(contractName, [])

    const publicKey = keyPair.getPublicKey()
    const wallet = await this._selector.wallet()
    const walletAccount = (await wallet.getAccounts())[0]
    const accountId = walletAccount.accountId

    const result = await wallet.signAndSendTransactions({
      transactions: [
        {
          receiverId: accountId,
          actions: [
            {
              type: 'AddKey',
              params: {
                publicKey: publicKey.toString(),
                accessKey: {
                  // ToDo
                  // @ts-ignore
                  permission: accessKey.permission.functionCall,
                },
              },
            },
          ],
          gas: TGas.mul(30),
        },
        {
          receiverId: contractName,
          actions: [
            {
              type: 'FunctionCall',
              params: {
                methodName,
                args,
                gas: gas ?? DefaultGas,
                deposit: deposit ?? '0',
              },
            },
          ],
        },
      ],
    })

    const keyStore = this._getKeyStoreForContract(contractName)
    await keyStore.setKey(this._nearConfig.networkId, accountId, keyPair)

    localStorage.setItem(
      `${contractName}_wallet_auth_key`,
      JSON.stringify({ accountId, allKeys: [walletAccount.publicKey] })
    )
    return result
  }
}
