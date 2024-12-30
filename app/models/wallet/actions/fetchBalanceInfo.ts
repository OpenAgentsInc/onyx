import { breezService } from "@/services/breez/breezService"
import { IWalletStoreBalance } from "./types"

export async function fetchBalanceInfo(store: IWalletStoreBalance) {
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