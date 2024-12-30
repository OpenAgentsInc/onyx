import { types } from "mobx-state-tree"
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
  .actions(self => ({
    setMnemonic(mnemonic: string) {
      self.mnemonic = mnemonic
    },
    setError(message: string | null) {
      self.error = message
    },
  }))
  .actions(self => ({
    async setup() {
      return await actions.setup(self as IWalletStore)
    },
    async fetchBalanceInfo() {
      await actions.fetchBalanceInfo(self as IWalletStore)
    },
  }))
  .actions(self => ({
    async disconnect() {
      return await actions.disconnect(self as IWalletStore)
    },
  }))
  .actions(self => ({
    async fetchTransactions() {
      return await actions.fetchTransactions(self as IWalletStore)
    },
    async sendPayment(bolt11: string, amount: number) {
      return await actions.sendPayment(self as IWalletStore, bolt11, amount)
    },
    async receivePayment(amount: number, description?: string) {
      return await actions.receivePayment(self as IWalletStore, amount, description)
    },
  }))