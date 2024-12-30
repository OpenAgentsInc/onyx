import { IStateTreeNode } from "mobx-state-tree"

// Base interface with minimal requirements
export interface IWalletStoreBase extends IStateTreeNode {
  mnemonic: string | null
  setMnemonic: (mnemonic: string) => void
}

// Extended interface with all requirements
export interface IWalletStore extends IWalletStoreBase {
  isInitialized: boolean
  balanceSat: number
  pendingSendSat: number
  pendingReceiveSat: number
  transactions: {
    clear: () => void
  }
  setError: (message: string | null) => void
  fetchBalanceInfo: () => Promise<void>
}