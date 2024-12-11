import { observer } from "mobx-react-lite"
import { useEffect } from "react"
import { useStores } from "app/models"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Alert } from "react-native"
import * as bip39 from "bip39"
import { breezService } from "@/services/breez"
import Constants from "expo-constants"

const MNEMONIC_KEY = '@breez_mnemonic'

/**
 * Ensures we have a mnemonic and initializes breez service
 */
export const WalletProvider = observer(function WalletProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { walletStore } = useStores()

  useEffect(() => {
    const initWallet = async () => {
      try {
        // 1. First check if there's a mnemonic in walletstore
        if (walletStore.mnemonic) {
          console.log("Using existing mnemonic from walletstore")
        } else {
          // 2. If no mnemonic in walletstore, check AsyncStorage
          const storedMnemonic = await AsyncStorage.getItem(MNEMONIC_KEY)
          if (storedMnemonic) {
            console.log("Found mnemonic in AsyncStorage")
            // Verify mnemonic is valid
            if (bip39.validateMnemonic(storedMnemonic)) {
              walletStore.setProp("mnemonic", storedMnemonic)
            }
          } else {
            // 3. If neither, generate new mnemonic
            console.log("Generating new mnemonic")
            const newMnemonic = bip39.generateMnemonic()
            await AsyncStorage.setItem(MNEMONIC_KEY, newMnemonic)
            walletStore.setProp("mnemonic", newMnemonic)
            Alert.alert("New Wallet Created", "A new wallet has been created for you.")
          }
        }

        // Initialize breez service with the mnemonic
        if (!breezService.isInitialized() && walletStore.mnemonic) {
          console.log("Initializing breez service")
          await breezService.initialize({
            workingDir: "", // Handled internally by the service
            apiKey: Constants.expoConfig?.extra?.BREEZ_API_KEY || "",
            network: "MAINNET",
            mnemonic: walletStore.mnemonic
          })
          
          // Fetch initial balance
          const balance = await breezService.getBalance()
          walletStore.setProp("balanceSat", balance.balanceSat)
          walletStore.setProp("pendingSendSat", balance.pendingSendSat)
          walletStore.setProp("pendingReceiveSat", balance.pendingReceiveSat)
          walletStore.setProp("isInitialized", true)
        }
      } catch (error) {
        console.error("Wallet initialization error:", error)
        walletStore.setProp("error", error instanceof Error ? error.message : "Failed to initialize wallet")
      }
    }

    initWallet()
  }, [walletStore])

  return <>{children}</>
})