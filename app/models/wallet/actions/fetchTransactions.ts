import { breezService } from "@/services/breez/breezService"
import { IWalletStoreWithTransactions } from "./types"

export async function fetchTransactions(store: IWalletStoreWithTransactions) {
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
}