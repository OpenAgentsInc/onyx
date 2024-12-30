import { breezService } from "@/services/breez/breezService"
import { IWalletStore } from "./types"
import { fetchBalanceInfo } from "./fetchBalanceInfo"

export async function sendPayment(store: IWalletStore, bolt11: string, amount: number) {
  if (!breezService.isInitialized()) {
    throw new Error("Wallet not initialized")
  }

  try {
    const tx = await breezService.sendPayment(bolt11, amount)
    store.transactions.push(tx)
    await fetchBalanceInfo(store)
    store.setError(null)
    return tx
  } catch (error) {
    console.error("[WalletStore] Send payment error:", error)
    store.setError(error instanceof Error ? error.message : "Failed to send payment")
    throw error
  }
}