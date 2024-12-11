import { observer } from "mobx-react-lite"
import { useEffect } from "react"
import { useStores } from "app/models"
import { ActivityIndicator, View } from "react-native"

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
    walletStore.initialize()
  }, [walletStore])

  if (!walletStore.isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000' }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    )
  }

  return <>{children}</>
})