import { SecureStorageService } from "@/services/storage/secureStorage"
import { log } from "@/utils/log"
import { WalletStore } from "../WalletStore"

export async function setup(store: WalletStore) {
  const mnemonic = await SecureStorageService.generateMnemonic()
  store.setMnemonic(mnemonic)
  log({
    name: "WalletStore",
    preview: "Generated mnemonic",
    value: mnemonic,
  })
}
