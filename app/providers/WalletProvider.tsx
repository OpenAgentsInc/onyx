import { observer } from "mobx-react-lite"
import { useEffect } from "react"
import { useStores } from "app/models"
import * as SecureStore from "expo-secure-store"
import { Alert } from "react-native"
import { generateMnemonic } from "@scure/bip39"
import { wordlist } from "@scure/bip39/wordlists/english"

const MNEMONIC_KEY = "onyx_mnemonic"

/**
 * Ensures we have a mnemonic
 */
export const WalletProvider = observer(function WalletProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { walletStore } = useStores()

  useEffect(() => {
    const initWallet = async () => {
      // 1. First check if there's a mnemonic in walletstore
      if (walletStore.mnemonic) {
        console.log("Using existing mnemonic from walletstore")
        return
      }

      // 2. If no mnemonic in walletstore, check secure storage
      const storedMnemonic = await SecureStore.getItemAsync(MNEMONIC_KEY)
      if (storedMnemonic) {
        console.log("Found mnemonic in secure storage")
        walletStore.setProp("mnemonic", storedMnemonic)
        return
      }

      // 3. If neither, generate new mnemonic
      console.log("Generating new mnemonic")
      const newMnemonic = generateMnemonic(wordlist)
      await SecureStore.setItemAsync(MNEMONIC_KEY, newMnemonic)
      walletStore.setProp("mnemonic", newMnemonic)
      Alert.alert("New Wallet Created", "A new wallet has been created for you.")
    }

    initWallet()
  }, [walletStore])

  return <>{children}</>
})