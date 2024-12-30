import { WalletSDK } from "wallet-sdk"
import { log } from "@/utils/log"

class Spark {
  generateMnemonic() {
    const sparkWallet = new WalletSDK("MAINNET");
    const mnemonic = sparkWallet.generateMnemonic();
    log({
      name: 'Spark',
      preview: 'Generated mnemonic',
      value: mnemonic,
    })

    const pubkey = sparkWallet.getMasterPublicKey();
    log({
      name: 'Spark',
      preview: 'Generated public key',
      value: pubkey,
    })
  }
}

export const spark = new Spark()