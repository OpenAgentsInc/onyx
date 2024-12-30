import { IStateTreeNode } from "mobx-state-tree"

export interface IWalletStore extends IStateTreeNode {
  mnemonic: string | null
  isInitialized: boolean
  setError: (message: string | null) => void
  fetchBalanceInfo: () => Promise<void>
}