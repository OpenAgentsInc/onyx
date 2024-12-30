import { IStateTreeNode, Instance, IAnyModelType } from "mobx-state-tree"

// Base store interface with just the properties
export interface IWalletStoreProps extends IStateTreeNode {
  isInitialized: boolean
  error: string | null
  balanceSat: number
  pendingSendSat: number
  pendingReceiveSat: number
  mnemonic: string | null
  transactions: {
    clear: () => void
    replace: (items: any[]) => void
    push: (item: any) => void
  }
}

// Basic actions interface
export interface IWalletStoreActions {
  setMnemonic: (mnemonic: string) => void
  setError: (message: string | null) => void
}

// Balance actions interface
export interface IWalletStoreBalanceActions {
  setup: () => Promise<void>
  fetchBalanceInfo: () => Promise<void>
}

// Full store interface combining all interfaces
export interface IWalletStore extends IWalletStoreProps, IWalletStoreActions, IWalletStoreBalanceActions {
  fetchTransactions: () => Promise<void>
  sendPayment: (bolt11: string, amount: number) => Promise<void>
  receivePayment: (amount: number, description?: string) => Promise<void>
  disconnect: () => Promise<void>
}

// Use a simple type alias to avoid circular references
export type WalletStore = Instance<IAnyModelType>