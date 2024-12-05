import { Instance, SnapshotIn, SnapshotOut, types, flow } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { breezService, Transaction } from "../services/breez"

const TransactionModel = types.model("Transaction", {
  id: types.string,
  amount: types.number,
  timestamp: types.number,
  type: types.enumeration(["send", "receive"]),
  status: types.enumeration(["pending", "complete", "failed"]),
  description: types.maybe(types.string),
  paymentHash: types.maybe(types.string),
  fee: types.maybe(types.number),
})

export const WalletStoreModel = types
  .model("WalletStore")
  .props({
    isInitialized: types.optional(types.boolean, false),
    error: types.maybeNull(types.string),
    balanceSat: types.number,
    pendingSendSat: types.number,
    pendingReceiveSat: types.number,
    transactions: types.array(TransactionModel),
  })
  .actions(withSetPropAction)
  .actions((self) => ({
    setError(message: string | null) {
      self.error = message
    },
  }))
  .actions((store) => ({
    initialize: flow(function* () {
      try {
        yield breezService.initialize({
          workingDir: "", // This is handled internally by the service
          apiKey: "MIIBfjCCATCgAwIBAgIHPYzgGw0A+zAFBgMrZXAwEDEOMAwGA1UEAxMFQnJlZXowHhcNMjQxMTI0MjIxOTMzWhcNMzQxMTIyMjIxOTMzWjA3MRkwFwYDVQQKExBPcGVuQWdlbnRzLCBJbmMuMRowGAYDVQQDExFDaHJpc3RvcGhlciBEYXZpZDAqMAUGAytlcAMhANCD9cvfIDwcoiDKKYdT9BunHLS2/OuKzV8NS0SzqV13o4GBMH8wDgYDVR0PAQH/BAQDAgWgMAwGA1UdEwEB/wQCMAAwHQYDVR0OBBYEFNo5o+5ea0sNMlW/75VgGJCv2AcJMB8GA1UdIwQYMBaAFN6q1pJW843ndJIW/Ey2ILJrKJhrMB8GA1UdEQQYMBaBFGNocmlzQG9wZW5hZ2VudHMuY29tMAUGAytlcANBABvQIfNsop0kGIk0bgO/2kPum5B5lv6pYaSBXz73G1RV+eZj/wuW88lNQoGwVER+rA9+kWWTaR/dpdi8AFwjxw0=",
          network: "MAINNET",
        })
        store.setProp("isInitialized", true)
        store.setError(null)
        
        // Now that we're initialized, fetch the initial balance
        yield store.fetchBalanceInfo()
      } catch (error) {
        console.error("Failed to initialize wallet:", error)
        store.setError(error instanceof Error ? error.message : "Failed to initialize wallet")
      }
    }),

    disconnect: flow(function* () {
      try {
        yield breezService.disconnect()
        store.setProp("isInitialized", false)
        store.setError(null)
      } catch (error) {
        console.error("Failed to disconnect wallet:", error)
        store.setError(error instanceof Error ? error.message : "Failed to disconnect wallet")
      }
    }),

    fetchBalanceInfo: flow(function* () {
      // Don't try to fetch if we're not initialized
      if (!breezService.isInitialized()) {
        console.log("Skipping balance fetch - not initialized yet")
        return
      }

      try {
        const info = yield breezService.getBalance()
        store.setProp("balanceSat", info.balanceSat)
        store.setProp("pendingSendSat", info.pendingSendSat)
        store.setProp("pendingReceiveSat", info.pendingReceiveSat)
        store.setError(null)
      } catch (error) {
        console.error("Error fetching balance info:", error)
        store.setError(error instanceof Error ? error.message : "Failed to fetch balance info")
      }
    }),

    fetchTransactions: flow(function* () {
      // Don't try to fetch if we're not initialized
      if (!breezService.isInitialized()) {
        console.log("Skipping transactions fetch - not initialized yet")
        return
      }

      try {
        const txs = yield breezService.getTransactions()
        store.setProp("transactions", txs)
        store.setError(null)
      } catch (error) {
        console.error("Error fetching transactions:", error)
        store.setError(error instanceof Error ? error.message : "Failed to fetch transactions")
      }
    }),

    sendPayment: flow(function* (bolt11: string, amount: number) {
      if (!breezService.isInitialized()) {
        throw new Error("Wallet not initialized")
      }

      try {
        const tx = yield breezService.sendPayment(bolt11, amount)
        store.transactions.push(tx)
        yield store.fetchBalanceInfo()
        store.setError(null)
        return tx
      } catch (error) {
        console.error("Error sending payment:", error)
        store.setError(error instanceof Error ? error.message : "Failed to send payment")
        throw error
      }
    }),

    receivePayment: flow(function* (amount: number, description?: string) {
      if (!breezService.isInitialized()) {
        throw new Error("Wallet not initialized")
      }

      try {
        const bolt11 = yield breezService.receivePayment(amount, description)
        store.setError(null)
        return bolt11
      } catch (error) {
        console.error("Error creating invoice:", error)
        store.setError(error instanceof Error ? error.message : "Failed to create invoice")
        throw error
      }
    }),
  }))
  .views((store) => ({
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
  }))

export interface WalletStore extends Instance<typeof WalletStoreModel> {}
export interface WalletStoreSnapshotOut extends SnapshotOut<typeof WalletStoreModel> {}
export interface WalletStoreSnapshotIn extends SnapshotIn<typeof WalletStoreModel> {}

// The singleton instance of the WalletStore
export const createWalletStoreDefaultModel = () =>
  WalletStoreModel.create({
    isInitialized: false,
    error: null,
    balanceSat: 0,
    pendingSendSat: 0,
    pendingReceiveSat: 0,
    transactions: [],
  })