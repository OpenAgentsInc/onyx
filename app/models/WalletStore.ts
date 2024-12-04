import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const WalletStoreModel = types
  .model("WalletStore")
  .props({
    balanceSat: types.number,
    pendingSendSat: types.number,
    pendingReceiveSat: types.number,
    transactions: types.array(types.frozen()),
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    setBalance(balance: number) {
      store.setProp("balanceSat", balance)
    },
    setPendingSend(amount: number) {
      store.setProp("pendingSendSat", amount)
    },
    setPendingReceive(amount: number) {
      store.setProp("pendingReceiveSat", amount)
    },
    setTransactions(txs: any[]) {
      store.setProp("transactions", txs)
    },
    async fetchBalanceInfo() {
      try {
        // We'll implement this in the hook that connects to Breez
        // since we need access to the SDK instance
      } catch (error) {
        console.error("Error fetching balance info:", error)
      }
    },
  }))
  .views((store) => ({
    get totalBalance() {
      return store.balanceSat
    },
    get hasPendingTransactions() {
      return store.pendingSendSat > 0 || store.pendingReceiveSat > 0
    },
  }))

export interface WalletStore extends Instance<typeof WalletStoreModel> {}
export interface WalletStoreSnapshotOut extends SnapshotOut<typeof WalletStoreModel> {}
export interface WalletStoreSnapshotIn extends SnapshotIn<typeof WalletStoreModel> {}

// The singleton instance of the WalletStore
export const createWalletStoreDefaultModel = () =>
  WalletStoreModel.create({
    balanceSat: 0,
    pendingSendSat: 0,
    pendingReceiveSat: 0,
    transactions: [],
  })