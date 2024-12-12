import { useStores } from "app/models"
import { observer } from "mobx-react-lite"
import { useEffect } from "react"
import { ActivityIndicator, Text, View } from "react-native"

/**
 * Ensures we have a mnemonic and initializes the wallet
 */
export const WalletProvider = observer(function WalletProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { walletStore } = useStores()

  useEffect(() => {
    console.log("[WalletProvider] Starting initialization")
    walletStore.initialize()
      .then(async () => {
        console.log("[WalletProvider] Initialized")
        await walletStore.fetchTransactions()
        console.log("[WalletProvider] Fetched transactions")
      })
      .catch(error => {
        console.error("[WalletProvider] Initialization error:", error)
      })
  }, [walletStore])

  if (!walletStore.isInitialized) {
    console.log("[WalletProvider] Showing loading state, error:", walletStore.error)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000' }}>
        <ActivityIndicator size="large" color="#ffffff" />
        {walletStore.error ? (
          <Text style={{ color: '#ff4444', marginTop: 20, textAlign: 'center', padding: 20 }}>
            {walletStore.error}
          </Text>
        ) : null}
      </View>
    )
  }

  return <>{children}</>
})
