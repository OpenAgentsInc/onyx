import { IStateTreeNode } from "mobx-state-tree"
import { WalletStore } from "./WalletStore"

export const views = (store: IStateTreeNode & WalletStore) => ({
  get totalBalance() {
    return store.balanceSat
  },
  get hasPendingTransactions() {
    return store.pendingSendSat > 0 || store.pendingReceiveSat > 0
  },
  get recentTransactions() {
    return store.transactions.slice().sort((a, b) => b.timestamp - a.timestamp)
  },
  get pendingTransactions() {
    return store.transactions.filter(tx => tx.status === "pending")
  },
})