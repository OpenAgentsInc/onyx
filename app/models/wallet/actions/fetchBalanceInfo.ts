import { breezService } from "@/services/breez/breezService"
import { IWalletStore } from "../types"

export async function fetchBalanceInfo(store: IWalletStore) {
  if (!store.isInitialized || !breezService.isInitialized()) {
    return
  }

  try {
    const balance = await breezService.getBalance()
    store.balanceSat = balance.confirmedBalance
    store.pendingSendSat = balance.pendingSend
    store.pendingReceiveSat = balance.pendingReceive
    store.setError(null)
  } catch (error) {
    console.error("[WalletStore] Balance fetch error:", error)
    store.setError(error instanceof Error ? error.message : "Failed to fetch balance")
  }
}