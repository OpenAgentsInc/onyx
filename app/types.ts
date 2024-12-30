import { IStateTreeNode, Instance } from "mobx-state-tree"
import { WalletStoreModel } from "./models/wallet/WalletStore"

// Wallet Store Types
export interface IWalletStoreBase extends IStateTreeNode {
  mnemonic: string | null
  setMnemonic: (mnemonic: string) => void
  setError: (message: string | null) => void
  error: string | null
}

export interface IWalletStoreBalance extends IWalletStoreBase {
  isInitialized: boolean
  balanceSat: number
  pendingSendSat: number
  pendingReceiveSat: number
}

export interface IWalletStoreWithTransactions extends IWalletStoreBalance {
  transactions: any[]
}

export interface IWalletStore extends IWalletStoreWithTransactions {
  fetchBalanceInfo: () => Promise<void>
  fetchTransactions: () => Promise<void>
  sendPayment: (bolt11: string, amount: number) => Promise<void>
  receivePayment: (amount: number, description?: string) => Promise<void>
  setup: () => Promise<void>
  disconnect: () => Promise<void>
}

export type WalletStore = Instance<typeof WalletStoreModel>