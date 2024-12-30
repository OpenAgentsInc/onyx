import { IStateTreeNode } from "mobx-state-tree"

// Base interface with minimal requirements
export interface IWalletStoreBase extends IStateTreeNode {
  mnemonic: string | null
  setMnemonic: (mnemonic: string) => void
  setError: (message: string | null) => void
}

// Interface for balance operations
export interface IWalletStoreBalance extends IWalletStoreBase {
  isInitialized: boolean
  balanceSat: number
  pendingSendSat: number
  pendingReceiveSat: number
}

// Interface for actions that need transactions
export interface IWalletStoreWithTransactions extends IWalletStoreBalance {
  transactions: {
    clear: () => void
    replace: (items: any[]) => void
    push: (item: any) => void
  }
}

// Extended interface with all requirements
export interface IWalletStore extends IWalletStoreWithTransactions {
  fetchBalanceInfo: () => Promise<void>
}