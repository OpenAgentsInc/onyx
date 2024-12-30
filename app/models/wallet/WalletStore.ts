import Constants from "expo-constants"
import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { breezService } from "@/services/breez/breezService"
import { SecureStorageService } from "@/services/storage/secureStorage"

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
    balanceSat: types.optional(types.number, 0),
    pendingSendSat: types.optional(types.number, 0),
    pendingReceiveSat: types.optional(types.number, 0),
    transactions: types.array(TransactionModel),
    mnemonic: types.maybeNull(types.string),
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
  .actions((store) => {
    // Helper function to set error state
    const setError = (message: string | null) => {
      store.error = message
    }

    // Helper function to fetch balance info
    const fetchBalanceInfo = async () => {
      if (!store.isInitialized || !breezService.isInitialized()) {
        return
      }

      try {
        const info = await breezService.getBalance()
        store.balanceSat = info.balanceSat
        store.pendingSendSat = info.pendingSendSat
        store.pendingReceiveSat = info.pendingReceiveSat
        setError(null)
      } catch (error) {
        console.error("[WalletStore] Balance fetch error:", error)
        setError(error instanceof Error ? error.message : "Failed to fetch balance info")
      }
    }

    return {
      async setup() {
        const mnemonic = await SecureStorageService.generateMnemonic()
        store.mnemonic = mnemonic
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
          setError(null)

          // Fetch initial balance
          await fetchBalanceInfo()
        } catch (error) {
          console.error("[WalletStore] Initialization error:", error)
          setError(error instanceof Error ? error.message : "Failed to initialize wallet")
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
          setError(null)

          // Fetch initial balance
          await fetchBalanceInfo()
          return true
        } catch (error) {
          console.error("[WalletStore] Restoration error:", error)
          setError(error instanceof Error ? error.message : "Failed to restore wallet")
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
          setError(null)
        } catch (error) {
          console.error("[WalletStore] Disconnect error:", error)
          setError(error instanceof Error ? error.message : "Failed to disconnect wallet")
        }
      },

      fetchBalanceInfo,

      async fetchTransactions() {
        if (!store.isInitialized || !breezService.isInitialized()) {
          return
        }

        try {
          const txs = await breezService.getTransactions()
          store.transactions.replace(txs.map(tx => ({
            ...tx,
            description: tx.description || undefined,
            paymentHash: tx.paymentHash || undefined,
            fee: tx.fee || undefined,
          })))
          setError(null)
        } catch (error) {
          console.error("[WalletStore] Transactions fetch error:", error)
          setError(error instanceof Error ? error.message : "Failed to fetch transactions")
        }
      },

      async sendPayment(bolt11: string, amount: number) {
        if (!breezService.isInitialized()) {
          throw new Error("Wallet not initialized")
        }

        try {
          const tx = await breezService.sendPayment(bolt11, amount)
          store.transactions.push(tx)
          await fetchBalanceInfo()
          setError(null)
          return tx
        } catch (error) {
          console.error("[WalletStore] Send payment error:", error)
          setError(error instanceof Error ? error.message : "Failed to send payment")
          throw error
        }
      },

      async receivePayment(amount: number, description?: string) {
        if (!breezService.isInitialized()) {
          throw new Error("Wallet not initialized")
        }

        try {
          const bolt11 = await breezService.receivePayment(amount, description)
          setError(null)
          return bolt11
        } catch (error) {
          console.error("[WalletStore] Receive payment error:", error)
          setError(error instanceof Error ? error.message : "Failed to create invoice")
          throw error
        }
      },
    }
  })

export interface WalletStore extends Instance<typeof WalletStoreModel> { }
export interface WalletStoreSnapshot extends SnapshotOut<typeof WalletStoreModel> { }
