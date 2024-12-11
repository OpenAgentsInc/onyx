import { observer } from "mobx-react-lite"
import { FC } from "react"
import { View, ViewStyle } from "react-native"
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

      <View style={$buttonRow}>
        <Button
          text="Send"
          onPress={() => {
            navigation.navigate("Send")
          }}
          style={$actionButton}
          preset="reversed"
        />
        <Button
          text="Receive"
          onPress={() => {
            navigation.navigate("Receive")
          }}
          style={$actionButton}
          preset="reversed"
        />
      </View>

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

const $buttonRow: ViewStyle = {
  flexDirection: "row",
  justifyContent: "center",
  gap: 20,
  marginBottom: 40,
  paddingHorizontal: 20,
}

const $actionButton: ViewStyle = {
  flex: 1,
  minWidth: 130,
}