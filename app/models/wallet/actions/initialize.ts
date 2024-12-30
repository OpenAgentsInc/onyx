import Constants from "expo-constants"
import { breezService } from "@/services/breez/breezService"
import { SecureStorageService } from "@/services/storage/secureStorage"
import { IWalletStore } from "../types"
import { fetchBalanceInfo } from "./fetchBalanceInfo"

export async function initialize(store: IWalletStore) {
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
    await fetchBalanceInfo(store)
  } catch (error) {
    console.error("[WalletStore] Initialization error:", error)
    store.setError(error instanceof Error ? error.message : "Failed to initialize wallet")
    throw error
  }
}
