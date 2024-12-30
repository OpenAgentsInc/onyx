import { IStateTreeNode } from "mobx-state-tree"
import { TransactionModel } from "../TransactionModel"

export interface IWalletStore extends IStateTreeNode {
  // Properties
  mnemonic: string | null
  isInitialized: boolean
  balanceSat: number
  pendingSendSat: number
  pendingReceiveSat: number
  transactions: {
    clear: () => void
  }

  // Methods
  setMnemonic: (mnemonic: string) => void
  setError: (message: string | null) => void
  fetchBalanceInfo: () => Promise<void>
}