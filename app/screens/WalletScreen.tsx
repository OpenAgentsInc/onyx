import { observer } from "mobx-react-lite"
import { FC } from "react"
import { ViewStyle } from "react-native"
import { Screen, Text } from "@/components"
import { MainTabScreenProps } from "@/navigators"

interface WalletScreenProps extends MainTabScreenProps<"Wallet"> { }

export const WalletScreen: FC<WalletScreenProps> = observer(function WalletScreen() {
  return (
    <Screen
      style={$root}
      contentContainerStyle={$contentContainer}
      preset="fixed"
    >
      <Text text="Wallet" style={$headerText} />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: 'black',
}

const $contentContainer: ViewStyle = {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
}

const $headerText = {
  color: 'white',
  fontSize: 24,
}