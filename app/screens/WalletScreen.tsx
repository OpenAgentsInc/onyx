import { observer } from "mobx-react-lite"
import { FC } from "react"
import { ViewStyle } from "react-native"
import { Screen, Text } from "@/components"
import { MainTabScreenProps } from "@/navigators"
import { BalanceDisplay } from "@/components/BalanceDisplay"
import { useBreez } from "@/providers/BreezProvider"

interface WalletScreenProps extends MainTabScreenProps<"Wallet"> { }

export const WalletScreen: FC<WalletScreenProps> = observer(function WalletScreen() {
  const { isInitialized } = useBreez()

  return (
    <Screen
      style={$root}
      contentContainerStyle={$contentContainer}
      preset="fixed"
    >
      <Text text="Wallet" style={$headerText} />
      {isInitialized ? (
        <BalanceDisplay />
      ) : (
        <Text text="Initializing wallet..." style={$loadingText} />
      )}
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
  paddingTop: 20,
}

const $headerText = {
  color: 'white',
  fontSize: 24,
  marginBottom: 20,
}

const $loadingText = {
  color: '#888',
  fontSize: 16,
}