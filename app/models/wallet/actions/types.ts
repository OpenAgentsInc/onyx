import { IStateTreeNode } from "mobx-state-tree"
import { TransactionModel } from "../TransactionModel"

// Base interface with minimal requirements
export interface IWalletStoreBase extends IStateTreeNode {
  mnemonic: string | null
  setMnemonic: (mnemonic: string) => void
  setError: (message: string | null) => void
}

// Interface for actions that need transactions
export interface IWalletStoreWithTransactions extends IWalletStoreBase {
  isInitialized: boolean
  balanceSat: number
  pendingSendSat: number
  pendingReceiveSat: number
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