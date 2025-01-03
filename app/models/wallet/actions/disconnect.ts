import { breezService } from "@/services/breez/breezService"
import { SecureStorageService } from "@/services/storage/secureStorage"
import { IWalletStore } from "../types"

export async function disconnect(store: IWalletStore) {
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
}
