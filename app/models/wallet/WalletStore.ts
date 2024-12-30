import { types, Instance } from "mobx-state-tree"
import * as actions from "./actions"
import { TransactionModel } from "./TransactionModel"
import { createViews } from "./views"
import { IWalletStore } from "./types"

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
  .views(createViews)
  .actions((store: IWalletStore) => ({
    setMnemonic(mnemonic: string) {
      store.mnemonic = mnemonic
    },
    setError(message: string | null) {
      store.error = message
    },
  }))
  .actions((store: IWalletStore) => ({
    async setup() {
      return await actions.setup(store)
    },
    async fetchBalanceInfo() {
      await actions.fetchBalanceInfo(store)
    },
  }))
  .actions((store: IWalletStore) => ({
    async disconnect() {
      return await actions.disconnect(store)
    },
  }))
  .actions((store: IWalletStore) => ({
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