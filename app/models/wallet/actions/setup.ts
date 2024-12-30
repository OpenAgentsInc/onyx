import { SecureStorageService } from "@/services/storage/secureStorage"
import { log } from "@/utils/log"
import { IWalletStoreBase } from "./types"

export async function setup(store: IWalletStoreBase) {
  const mnemonic = await SecureStorageService.generateMnemonic()
  store.setMnemonic(mnemonic)
  log({
    name: "WalletStore",
    preview: "Generated mnemonic",
    value: mnemonic,
  })
}