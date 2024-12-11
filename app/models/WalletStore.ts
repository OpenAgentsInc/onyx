import Constants from "expo-constants"
import { flow, Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { breezService, Transaction } from "../services/breez"
import { withSetPropAction } from "./helpers/withSetPropAction"

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

// Default mnemonic for development - DO NOT USE IN PRODUCTION
const DEV_MNEMONIC = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"

export const WalletStoreModel = types
  .model("WalletStore")
  .props({
    isInitialized: types.optional(types.boolean, false),
    error: types.maybeNull(types.string),
    balanceSat: types.number,
    pendingSendSat: types.number,
    pendingReceiveSat: types.number,
    transactions: types.array(TransactionModel),
    mnemonic: types.maybeNull(types.string),
  })
  .actions(withSetPropAction)
  .actions((self) => {
    const setError = (message: string | null) => {
      self.error = message
    }

    const initialize = flow(function* (customMnemonic?: string) {
      try {
        const breezApiKey = Constants.expoConfig?.extra?.BREEZ_API_KEY

        // For development, proceed without Breez initialization if API key is missing
        if (!breezApiKey) {
          console.warn("BREEZ_API_KEY not set - using development mode")
          self.isInitialized = true
          self.mnemonic = customMnemonic || DEV_MNEMONIC
          return
        }

        // If we were previously initialized, disconnect first
        if (breezService.isInitialized()) {
          yield breezService.disconnect()
        }

        yield breezService.initialize({
          workingDir: "", // This is handled internally by the service
          apiKey: breezApiKey,
          network: "MAINNET",
        })
        self.isInitialized = true
        setError(null)

        // Store the mnemonic
        const mnemonic = yield breezService.getMnemonic()
        self.mnemonic = mnemonic

        // Now that we're initialized, fetch the initial balance
        yield fetchBalanceInfo()
      } catch (error) {
        console.error("Failed to initialize wallet:", error)
        // For development, proceed with default mnemonic on error
        console.warn("Using development mnemonic after initialization error")
        self.isInitialized = true
        self.mnemonic = customMnemonic || DEV_MNEMONIC
      }
    })

    const restoreWallet = flow(function* (mnemonic: string) {
      try {
        // Reset the store state
        self.isInitialized = false
        self.balanceSat = 0
        self.pendingSendSat = 0
        self.pendingReceiveSat = 0
        self.transactions.clear()

        // Initialize with new mnemonic
        yield initialize(mnemonic)

        if (!self.isInitialized) {
          throw new Error("Failed to initialize wallet with provided seed phrase")
        }

        setError(null)
        return true
      } catch (error) {
        console.error("Failed to restore wallet:", error)
        setError(error instanceof Error ? error.message : "Failed to restore wallet")
        return false
      }
    })

    const disconnect = flow(function* () {
      try {
        if (breezService.isInitialized()) {
          yield breezService.disconnect()
        }
        self.isInitialized = false
        self.mnemonic = null
        setError(null)
      } catch (error) {
        console.error("Failed to disconnect wallet:", error)
        setError(error instanceof Error ? error.message : "Failed to disconnect wallet")
      }
    })

    const fetchBalanceInfo = flow(function* () {
      // Skip if we're in development mode without Breez
      if (!Constants.expoConfig?.extra?.BREEZ_API_KEY) {
        return
      }

      // Don't try to fetch if we're not initialized
      if (!breezService.isInitialized()) {
        console.log("Skipping balance fetch - not initialized yet")
        return
      }

      try {
        const info = yield breezService.getBalance()
        self.balanceSat = info.balanceSat
        self.pendingSendSat = info.pendingSendSat
        self.pendingReceiveSat = info.pendingReceiveSat
        setError(null)
      } catch (error) {
        console.error("Error fetching balance info:", error)
        setError(error instanceof Error ? error.message : "Failed to fetch balance info")
      }
    })

    const fetchTransactions = flow(function* () {
      // Skip if we're in development mode without Breez
      if (!Constants.expoConfig?.extra?.BREEZ_API_KEY) {
        return
      }

      // Don't try to fetch if we're not initialized
      if (!breezService.isInitialized()) {
        console.log("Skipping transactions fetch - not initialized yet")
        return
      }

      try {
        const txs = yield breezService.getTransactions()
        self.transactions.replace(txs)
        setError(null)
      } catch (error) {
        console.error("Error fetching transactions:", error)
        setError(error instanceof Error ? error.message : "Failed to fetch transactions")
      }
    })

    const sendPayment = flow(function* (bolt11: string, amount: number) {
      if (!breezService.isInitialized()) {
        throw new Error("Wallet not initialized")
      }

      try {
        const tx = yield breezService.sendPayment(bolt11, amount)
        self.transactions.push(tx)
        yield fetchBalanceInfo()
        setError(null)
        return tx
      } catch (error) {
        console.error("Error sending payment:", error)
        setError(error instanceof Error ? error.message : "Failed to send payment")
        throw error
      }
    })

    const receivePayment = flow(function* (amount: number, description?: string) {
      if (!breezService.isInitialized()) {
        throw new Error("Wallet not initialized")
      }

      try {
        const bolt11 = yield breezService.receivePayment(amount, description)
        setError(null)
        return bolt11
      } catch (error) {
        console.error("Error creating invoice:", error)
        setError(error instanceof Error ? error.message : "Failed to create invoice")
        throw error
      }
    })

    return {
      setError,
      initialize,
      disconnect,
      restoreWallet,
      fetchBalanceInfo,
      fetchTransactions,
      sendPayment,
      receivePayment,
    }
  })
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

export interface WalletStore extends Instance<typeof WalletStoreModel> { }
export interface WalletStoreSnapshotOut extends SnapshotOut<typeof WalletStoreModel> { }
export interface WalletStoreSnapshotIn extends SnapshotIn<typeof WalletStoreModel> { }

// The singleton instance of the WalletStore
export const createWalletStoreDefaultModel = () =>
  WalletStoreModel.create({
    isInitialized: false,
    error: null,
    balanceSat: 0,
    pendingSendSat: 0,
    pendingReceiveSat: 0,
    transactions: [],
    mnemonic: null,
  })
