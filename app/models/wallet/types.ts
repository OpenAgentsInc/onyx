import { IStateTreeNode, Instance, IAnyModelType } from "mobx-state-tree"
import { TransactionModel } from "./TransactionModel"

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
  transactions: {
    clear: () => void
    replace: (items: any[]) => void
    push: (item: any) => void
  }
}

export interface IWalletStore extends IWalletStoreWithTransactions {
  fetchBalanceInfo: () => Promise<void>
  fetchTransactions: () => Promise<void>
  sendPayment: (bolt11: string, amount: number) => Promise<void>
  receivePayment: (amount: number, description?: string) => Promise<void>
  setup: () => Promise<void>
  disconnect: () => Promise<void>
}

// Break circular reference by using a simpler type
export type WalletStore = Instance<IAnyModelType>