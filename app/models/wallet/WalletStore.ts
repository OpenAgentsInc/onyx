import { Instance, SnapshotOut, types } from "mobx-state-tree"
import * as actions from "./actions"
import { TransactionModel } from "./TransactionModel"
import { views } from "./views"

export const WalletStoreModel = types
  .model("WalletStore")
  .props({
    isInitialized: types.optional(types.boolean, false),
    error: types.maybeNull(types.string),
    balanceSat: types.optional(types.number, 0),
    pendingSendSat: types.optional(types.number, 0),
    pendingReceiveSat: types.optional(types.number, 0),
    transactions: types.array(TransactionModel),
    mnemonic: types.maybeNull(types.string),
  })
  .views(views)
  // Basic actions that don't depend on anything else
  .actions((store) => ({
    setMnemonic(mnemonic: string) {
      store.mnemonic = mnemonic
    },
    setError(message: string | null) {
      store.error = message
    },
  }))
  // Add fetchBalanceInfo first since other actions depend on it
  .actions((store) => ({
    async setup() {
      return await actions.setup(store)
    },
    async fetchBalanceInfo() {
      await actions.fetchBalanceInfo(store)
    },
  }))
  // Actions that depend on basic actions
  .actions((store) => ({
    async disconnect() {
      return await actions.disconnect(store)
    },
  }))
  // Actions that depend on fetchBalanceInfo
  .actions((store) => ({
    async fetchTransactions() {
      return await actions.fetchTransactions(store)
    },
    async sendPayment(bolt11: string, amount: number) {
      return await actions.sendPayment(store, bolt11, amount)
    },
    async receivePayment(amount: number, description?: string) {
      return await actions.receivePayment(store, amount, description)
    },
  }))

export interface WalletStore extends Instance<typeof WalletStoreModel> { }
export interface WalletStoreSnapshot extends SnapshotOut<typeof WalletStoreModel> { }