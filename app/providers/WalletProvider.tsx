import { observer } from "mobx-react-lite"
import { useEffect } from "react"
import { useStores } from "app/models"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Alert } from "react-native"
import * as bip39 from "bip39"

const MNEMONIC_KEY = '@breez_mnemonic'

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

      // 2. If no mnemonic in walletstore, check AsyncStorage
      const storedMnemonic = await AsyncStorage.getItem(MNEMONIC_KEY)
      if (storedMnemonic) {
        console.log("Found mnemonic in AsyncStorage")
        // Verify mnemonic is valid
        if (bip39.validateMnemonic(storedMnemonic)) {
          walletStore.setProp("mnemonic", storedMnemonic)
          return
        }
      }

      // 3. If neither, generate new mnemonic
      console.log("Generating new mnemonic")
      const newMnemonic = bip39.generateMnemonic()
      await AsyncStorage.setItem(MNEMONIC_KEY, newMnemonic)
      walletStore.setProp("mnemonic", newMnemonic)
      Alert.alert("New Wallet Created", "A new wallet has been created for you.")
    }

    initWallet()
  }, [walletStore])

  return <>{children}</>
})