import Constants from "expo-constants"
import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { breezService } from "@/services/breez/breezService"
import { SecureStorageService } from "@/services/storage/secureStorage"
import { Transaction } from "@/services/breez/types"

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
    authToken: types.maybe(types.string),
    authEmail: "",
    isInitialized: types.optional(types.boolean, false),
    error: types.maybeNull(types.string),
    balanceSat: types.optional(types.number, 0),
    pendingSendSat: types.optional(types.number, 0),
    pendingReceiveSat: types.optional(types.number, 0),
    transactions: types.array(TransactionModel),
    mnemonic: types.maybeNull(types.string),
  })
  .views((store) => ({
    get isAuthenticated() {
      return !!store.authToken
    },
    get validationError() {
      if (store.authEmail.length === 0) return "can't be blank"
      if (store.authEmail.length < 6) return "must be at least 6 characters"
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(store.authEmail))
        return "must be a valid email address"
      return ""
    },
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
  .actions((store) => ({
    async setup() {
      const mnemonic = await SecureStorageService.generateMnemonic()
      store.mnemonic = mnemonic
    },
    setAuthToken(value?: string) {
      store.authToken = value
    },
    setAuthEmail(value: string) {
      store.authEmail = value.replace(/ /g, "")
    },
    logout() {
      store.authToken = undefined
      store.authEmail = ""
    },
    setError(message: string | null) {
      store.error = message
    },
    async initialize() {
      try {
        // Get mnemonic from secure storage if not in store
        if (!store.mnemonic) {
          const storedMnemonic = await SecureStorageService.getMnemonic()
          if (storedMnemonic) {
            store.mnemonic = storedMnemonic
          } else {
            const newMnemonic = await SecureStorageService.generateMnemonic()
            store.mnemonic = newMnemonic
          }
        }

        const breezApiKey = Constants.expoConfig?.extra?.BREEZ_API_KEY
        if (!breezApiKey) {
          console.warn("[WalletStore] BREEZ_API_KEY not set - using development mode")
          store.isInitialized = true
          return
        }

        // If we were previously initialized, disconnect first
        if (breezService.isInitialized()) {
          await breezService.disconnect()
        }

        // Initialize breez with the mnemonic
        await breezService.initialize({
          workingDir: "", // This is handled internally by the service
          apiKey: breezApiKey,
          network: "MAINNET",
          mnemonic: store.mnemonic,
        })

        store.isInitialized = true
        store.setError(null)

        // Fetch initial balance
        await store.fetchBalanceInfo()
      } catch (error) {
        console.error("[WalletStore] Initialization error:", error)
        store.setError(error instanceof Error ? error.message : "Failed to initialize wallet")
        throw error
      }
    },
    async restoreWallet(mnemonic: string) {
      try {
        // First disconnect if we're initialized
        if (breezService.isInitialized()) {
          await breezService.disconnect()
        }

        // Reset the store state
        store.isInitialized = false
        store.balanceSat = 0
        store.pendingSendSat = 0
        store.pendingReceiveSat = 0
        store.transactions.clear()
        store.mnemonic = null

        // Validate and save mnemonic to secure storage
        const saved = await SecureStorageService.setMnemonic(mnemonic)
        if (!saved) {
          throw new Error("Failed to save mnemonic")
        }

        // Set mnemonic in store
        store.mnemonic = mnemonic

        // Initialize with new mnemonic
        const breezApiKey = Constants.expoConfig?.extra?.BREEZ_API_KEY
        if (!breezApiKey) {
          throw new Error("BREEZ_API_KEY not set")
        }

        // Initialize breez with the new mnemonic
        await breezService.initialize({
          workingDir: "",
          apiKey: breezApiKey,
          network: "MAINNET",
          mnemonic: mnemonic,
        })

        store.isInitialized = true
        store.setError(null)

        // Fetch initial balance
        await store.fetchBalanceInfo()
        return true
      } catch (error) {
        console.error("[WalletStore] Restoration error:", error)
        store.setError(error instanceof Error ? error.message : "Failed to restore wallet")
        return false
      }
    },
    async disconnect() {
      try {
        if (breezService.isInitialized()) {
          await breezService.disconnect()
        }
        await SecureStorageService.deleteMnemonic()
        store.isInitialized = false
        store.mnemonic = null
        store.setError(null)
      } catch (error) {
        console.error("[WalletStore] Disconnect error:", error)
        store.setError(error instanceof Error ? error.message : "Failed to disconnect wallet")
      }
    },
    async fetchBalanceInfo() {
      if (!store.isInitialized || !breezService.isInitialized()) {
        return
      }

      try {
        const info = await breezService.getBalance()
        store.balanceSat = info.balanceSat
        store.pendingSendSat = info.pendingSendSat
        store.pendingReceiveSat = info.pendingReceiveSat
        store.setError(null)
      } catch (error) {
        console.error("[WalletStore] Balance fetch error:", error)
        store.setError(error instanceof Error ? error.message : "Failed to fetch balance info")
      }
    },
    async fetchTransactions() {
      if (!store.isInitialized || !breezService.isInitialized()) {
        return
      }

      try {
        const txs = await breezService.getTransactions()
        store.transactions.replace(txs)
        store.setError(null)
      } catch (error) {
        console.error("[WalletStore] Transactions fetch error:", error)
        store.setError(error instanceof Error ? error.message : "Failed to fetch transactions")
      }
    },
    async sendPayment(bolt11: string, amount: number) {
      if (!breezService.isInitialized()) {
        throw new Error("Wallet not initialized")
      }

      try {
        const tx = await breezService.sendPayment(bolt11, amount)
        store.transactions.push(tx)
        await store.fetchBalanceInfo()
        store.setError(null)
        return tx
      } catch (error) {
        console.error("[WalletStore] Send payment error:", error)
        store.setError(error instanceof Error ? error.message : "Failed to send payment")
        throw error
      }
    },
    async receivePayment(amount: number, description?: string) {
      if (!breezService.isInitialized()) {
        throw new Error("Wallet not initialized")
      }

      try {
        const bolt11 = await breezService.receivePayment(amount, description)
        store.setError(null)
        return bolt11
      } catch (error) {
        console.error("[WalletStore] Receive payment error:", error)
        store.setError(error instanceof Error ? error.message : "Failed to create invoice")
        throw error
      }
    },
  }))

export interface WalletStore extends Instance<typeof WalletStoreModel> { }
export interface WalletStoreSnapshot extends SnapshotOut<typeof WalletStoreModel> { }