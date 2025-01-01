import { observer } from "mobx-react-lite"
import { FC } from "react"
import { ViewStyle } from "react-native"
import { Screen } from "@/components"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { WalletStackParamList } from "@/navigators/WalletNavigator"

interface SendScreenProps extends NativeStackScreenProps<WalletStackParamList, "Send"> {}

export const SendScreen: FC<SendScreenProps> = observer(function SendScreen() {
  return (
    <Screen style={$root} preset="scroll">
      {/* TODO: Implement send screen */}
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}