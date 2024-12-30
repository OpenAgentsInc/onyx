import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { spark } from "@/services/spark/spark"
import { SecureStorageService } from "@/services/storage/secureStorage"

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
  }))
  .actions((store) => ({
    async setup() {
      spark.generateMnemonic()
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

        // Initialize spark with the mnemonic
        await spark.createSparkWallet(store.mnemonic)

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
        if (store.isInitialized) {
          await spark.reset()
        }

        // Reset the store state
        store.isInitialized = false
        store.balanceSat = 0
        store.pendingSendSat = 0
        store.pendingReceiveSat = 0
        store.mnemonic = null

        // Validate and save mnemonic to secure storage
        const saved = await SecureStorageService.setMnemonic(mnemonic)
        if (!saved) {
          throw new Error("Failed to save mnemonic")
        }

        // Set mnemonic in store
        store.mnemonic = mnemonic

        // Initialize with new mnemonic
        await spark.createSparkWallet(mnemonic)

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
        if (store.isInitialized) {
          await spark.reset()
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
      if (!store.isInitialized) {
        return
      }

      try {
        const balance = await spark.getBtcBalance()
        store.balanceSat = Number(balance)
        store.setError(null)
      } catch (error) {
        console.error("[WalletStore] Balance fetch error:", error)
        store.setError(error instanceof Error ? error.message : "Failed to fetch balance info")
      }
    },
  }))

export interface WalletStore extends Instance<typeof WalletStoreModel> { }
export interface WalletStoreSnapshot extends SnapshotOut<typeof WalletStoreModel> { }