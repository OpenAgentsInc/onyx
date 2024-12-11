import { observer } from "mobx-react-lite"
import { FC } from "react"
import { ViewStyle } from "react-native"
import { Button, Screen } from "@/components"
import { BalanceDisplay } from "@/components/BalanceDisplay"
import BalanceHeader from "@/components/BalanceHeader"
import { useStores } from "@/models"
import { MainTabScreenProps } from "@/navigators"

interface WalletScreenProps extends MainTabScreenProps<"Wallet"> { }

export const WalletScreen: FC<WalletScreenProps> = observer(function WalletScreen({ navigation }) {
  const { walletStore } = useStores()
  const { isInitialized } = walletStore

  return (
    <Screen
      style={$root}
      contentContainerStyle={$contentContainer}
      preset="fixed"
    >
      <BalanceHeader />

      <Button
        text="Backup wallet"
        onPress={() => {
          navigation.navigate("BackupWallet")
        }}
        style={{ marginBottom: 25, width: 300 }}
      />
      <Button
        text="Restore wallet"
        onPress={() => {
          navigation.navigate("RestoreWallet")
        }}
        style={{ marginBottom: 50, width: 300 }}
      />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: "black",
}

const $contentContainer: ViewStyle = {
  flex: 1,
  alignItems: "center",
  paddingTop: 20,
}