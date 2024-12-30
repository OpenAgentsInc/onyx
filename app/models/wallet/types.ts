import { IStateTreeNode, Instance, IAnyModelType } from "mobx-state-tree"

// Base store interface with just the properties
export interface IWalletStoreBase extends IStateTreeNode {
  isInitialized: boolean
  error: string | null
  mnemonic: string | null
  setMnemonic: (mnemonic: string) => void
  setError: (message: string | null) => void
}

// Balance related properties and actions
export interface IWalletStoreBalance extends IWalletStoreBase {
  balanceSat: number
  pendingSendSat: number
  pendingReceiveSat: number
  fetchBalanceInfo: () => Promise<void>
}

// Store with transactions
export interface IWalletStoreWithTransactions extends IWalletStoreBalance {
  transactions: {
    clear: () => void
    replace: (items: any[]) => void
    push: (item: any) => void
  }
}

// Full store interface
export interface IWalletStore extends IWalletStoreWithTransactions {
  setup: () => Promise<void>
  fetchTransactions: () => Promise<void>
  sendPayment: (bolt11: string, amount: number) => Promise<void>
  receivePayment: (amount: number, description?: string) => Promise<void>
  disconnect: () => Promise<void>
}

// Use a simple type alias to avoid circular references
export type WalletStore = Instance<IAnyModelType>