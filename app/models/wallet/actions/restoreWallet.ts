import Constants from "expo-constants"
import { breezService } from "@/services/breez"
import { SecureStorageService } from "@/services/storage/secureStorage"
import { WalletStore } from "../WalletStore"

export async function restoreWallet(store: WalletStore, mnemonic: string) {
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
}
