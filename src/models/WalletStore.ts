import Constants from "expo-constants"
import { flow, Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { breezService, Transaction } from "../services/breez"
import { SecureStorageService } from "../services/storage/secureStorage"
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
      // console.log("[WalletStore] Setting error:", message)
      self.error = message
    }

    const initialize = flow(function* () {
      try {
        // console.log("[WalletStore] Starting initialization")

        // Get mnemonic from secure storage if not in store
        if (!self.mnemonic) {
          // console.log("[WalletStore] No mnemonic in store, checking secure storage")
          const storedMnemonic = yield SecureStorageService.getMnemonic()
          if (storedMnemonic) {
            // console.log("[WalletStore] Found mnemonic in secure storage")
            self.mnemonic = storedMnemonic
          } else {
            // console.log("[WalletStore] Generating new mnemonic")
            const newMnemonic = yield SecureStorageService.generateMnemonic()
            self.mnemonic = newMnemonic
          }
        }

        const breezApiKey = Constants.expoConfig?.extra?.BREEZ_API_KEY
        if (!breezApiKey) {
          console.warn("[WalletStore] BREEZ_API_KEY not set - using development mode")
          self.isInitialized = true
          return
        }

        // If we were previously initialized, disconnect first
        if (breezService.isInitialized()) {
          // console.log("[WalletStore] Disconnecting previous breez instance")
          yield breezService.disconnect()
        }

        // Initialize breez with the mnemonic
        // console.log("[WalletStore] Initializing breez service")
        yield breezService.initialize({
          workingDir: "", // This is handled internally by the service
          apiKey: breezApiKey,
          network: "MAINNET",
          mnemonic: self.mnemonic,
        })

        // console.log("[WalletStore] Breez initialized, fetching balance")
        self.isInitialized = true
        setError(null)

        // Fetch initial balance
        yield fetchBalanceInfo()
        // console.log("[WalletStore] Initialization complete")
      } catch (error) {
        console.error("[WalletStore] Initialization error:", error)
        setError(error instanceof Error ? error.message : "Failed to initialize wallet")
        throw error
      }
    })

    const restoreWallet = flow(function* (mnemonic: string) {
      try {
        // console.log("[WalletStore] Starting wallet restoration")

        // First disconnect if we're initialized
        if (breezService.isInitialized()) {
          // console.log("[WalletStore] Disconnecting previous breez instance")
          yield breezService.disconnect()
        }

        // Reset the store state
        // console.log("[WalletStore] Resetting store state")
        self.isInitialized = false
        self.balanceSat = 0
        self.pendingSendSat = 0
        self.pendingReceiveSat = 0
        self.transactions.clear()
        self.mnemonic = null

        // Validate and save mnemonic to secure storage
        // console.log("[WalletStore] Saving mnemonic to secure storage")
        const saved = yield SecureStorageService.setMnemonic(mnemonic)
        if (!saved) {
          throw new Error("Failed to save mnemonic")
        }

        // Set mnemonic in store
        self.mnemonic = mnemonic

        // Initialize with new mnemonic
        const breezApiKey = Constants.expoConfig?.extra?.BREEZ_API_KEY
        if (!breezApiKey) {
          throw new Error("BREEZ_API_KEY not set")
        }

        // Initialize breez with the new mnemonic
        // console.log("[WalletStore] Initializing breez with restored mnemonic")
        yield breezService.initialize({
          workingDir: "",
          apiKey: breezApiKey,
          network: "MAINNET",
          mnemonic: mnemonic,
        })

        // console.log("[WalletStore] Breez initialized, fetching balance")
        self.isInitialized = true
        setError(null)

        // Fetch initial balance
        yield fetchBalanceInfo()
        // console.log("[WalletStore] Restoration complete")
        return true
      } catch (error) {
        console.error("[WalletStore] Restoration error:", error)
        setError(error instanceof Error ? error.message : "Failed to restore wallet")
        return false
      }
    })

    const disconnect = flow(function* () {
      try {
        // console.log("[WalletStore] Disconnecting wallet")
        if (breezService.isInitialized()) {
          yield breezService.disconnect()
        }
        yield SecureStorageService.deleteMnemonic()
        self.isInitialized = false
        self.mnemonic = null
        setError(null)
      } catch (error) {
        console.error("[WalletStore] Disconnect error:", error)
        setError(error instanceof Error ? error.message : "Failed to disconnect wallet")
      }
    })

    const fetchBalanceInfo = flow(function* () {
      if (!self.isInitialized || !breezService.isInitialized()) {
        // console.log("[WalletStore] Skipping balance fetch - not initialized")
        return
      }

      try {
        // console.log("[WalletStore] Fetching balance")
        const info = yield breezService.getBalance()
        // console.log("[WalletStore] Balance info:", info)
        self.balanceSat = info.balanceSat
        self.pendingSendSat = info.pendingSendSat
        self.pendingReceiveSat = info.pendingReceiveSat
        setError(null)
      } catch (error) {
        console.error("[WalletStore] Balance fetch error:", error)
        setError(error instanceof Error ? error.message : "Failed to fetch balance info")
      }
    })

    const fetchTransactions = flow(function* () {
      if (!self.isInitialized || !breezService.isInitialized()) {
        // console.log("[WalletStore] Skipping transactions fetch - not initialized")
        return
      }

      try {
        // console.log("[WalletStore] Fetching transactions")
        const txs = yield breezService.getTransactions()
        self.transactions.replace(txs)
        setError(null)
      } catch (error) {
        console.error("[WalletStore] Transactions fetch error:", error)
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
        console.error("[WalletStore] Send payment error:", error)
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
        console.error("[WalletStore] Receive payment error:", error)
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
