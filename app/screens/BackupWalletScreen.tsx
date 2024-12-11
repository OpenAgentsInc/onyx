import { observer } from "mobx-react-lite"
import { FC } from "react"
import { Alert, Clipboard, ViewStyle } from "react-native"
import { Button, Screen, Text } from "@/components"
// import { useNavigation } from "@react-navigation/native"
import { useStores } from "@/models"
import { AppStackScreenProps } from "@/navigators"
import * as alert from "@/utils/alert"

interface BackupWalletScreenProps extends AppStackScreenProps<"BackupWallet"> { }

export const BackupWalletScreen: FC<BackupWalletScreenProps> = observer(function BackupWalletScreen() {

  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  const { walletStore } = useStores()


  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root} preset="scroll" contentContainerStyle={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 25
    }}>
      <Text text={walletStore.mnemonic ?? "-"} />
      <Button
        text="Copy to clipboard"
        onPress={() => {
          Clipboard.setString(walletStore.mnemonic ?? "-");
          alert.warn({
            title: 'Careful now!',
            message: 'Paste the recovery phrase into your password manager. Then come back to this app and press to empty the clipboard.',
            onOk: () => Clipboard.setString(''),
            okText: 'Empty Clipboard',
          });
        }}
        style={{ marginVertical: 50, width: 300 }}
      />
    </Screen>
  )

})

const $root: ViewStyle = {
  flex: 1,
}
