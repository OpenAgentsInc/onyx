import { breezService } from "@/services/breez"
import { IWalletStore } from "../types"

export async function sendPayment(store: IWalletStore, bolt11: string, amount: number) {
  try {
    const result = await breezService.sendPayment(bolt11, amount)
    
    // Update transactions using the store action
    const currentTxs = store.transactions.slice()
    currentTxs.unshift(result)
    store.setTransactions(currentTxs)
    
    return result
  } catch (err) {
    console.error("[WalletStore] Send payment error:", err)
    throw err
  }
}