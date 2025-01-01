import { observer } from "mobx-react-lite"
import { FC } from "react"
import { Alert, Clipboard, ViewStyle } from "react-native"
import { Button, Screen, Text } from "@/components"
import { useStores } from "@/models"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { WalletStackParamList } from "@/navigators/WalletNavigator"
import * as alert from "@/utils/alert"

interface BackupWalletScreenProps extends NativeStackScreenProps<WalletStackParamList, "BackupWallet"> {}

export const BackupWalletScreen: FC<BackupWalletScreenProps> = observer(
  function BackupWalletScreen() {
    const { walletStore } = useStores()

    return (
      <Screen
        style={$root}
        preset="scroll"
        contentContainerStyle={{
          flex: 1,
          alignItems: "center",
          paddingHorizontal: 25,
          paddingVertical: 50,
        }}
      >
        <Text text={walletStore.mnemonic ?? "-"} />
        <Button
          text="Copy to clipboard"
          onPress={() => {
            Clipboard.setString(walletStore.mnemonic ?? "-")
            alert.warn({
              title: "Careful now!",
              message:
                "Paste the recovery phrase into your password manager. Then come back to this app and press to empty the clipboard.",
              onOk: () => Clipboard.setString(""),
              okText: "Empty Clipboard",
              err: null,
            })
          }}
          style={{ marginVertical: 50, width: 300 }}
        />
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}