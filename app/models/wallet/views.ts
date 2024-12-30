import { Instance, IStateTreeNode, IAnyModelType } from "mobx-state-tree"
import { WalletStoreModel } from "./WalletStore"

type Store = Instance<typeof WalletStoreModel>

export const createViews = (self: Store) => ({
  get totalBalance() {
    return self.balanceSat
  },
  get hasPendingTransactions() {
    return self.pendingSendSat > 0 || self.pendingReceiveSat > 0
  },
  get recentTransactions() {
    return self.transactions.slice().sort((a, b) => b.timestamp - a.timestamp)
  },
  get pendingTransactions() {
    return self.transactions.filter(tx => tx.status === "pending")
  },
})