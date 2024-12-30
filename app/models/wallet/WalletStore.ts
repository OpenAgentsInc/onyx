import Constants from "expo-constants"
import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { breezService } from "@/services/breez/breezService"
import { SecureStorageService } from "@/services/storage/secureStorage"
import { log } from "@/utils/log"
import * as actions from "./actions"
import { TransactionModel } from "./TransactionModel"

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
  .actions((store) => ({
    setMnemonic(mnemonic: string) {
      store.mnemonic = mnemonic
    },
    setError(message: string | null) {
      store.error = message
    },
  }))
  .actions((store) => {
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
        store.setError(null)
      } catch (error) {
        console.error("[WalletStore] Balance fetch error:", error)
        store.setError(error instanceof Error ? error.message : "Failed to fetch balance info")
      }
    }

    return {
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
          await fetchBalanceInfo()
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
    }
  }))
  // Move setup action to the end after all other actions are defined
  .actions((store) => ({
    async setup() {
      return await actions.setup(store)
    }
  }))

export interface WalletStore extends Instance<typeof WalletStoreModel> { }
export interface WalletStoreSnapshot extends SnapshotOut<typeof WalletStoreModel> { }