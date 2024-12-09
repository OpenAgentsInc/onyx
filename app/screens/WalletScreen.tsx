import { observer } from "mobx-react-lite"
import { FC } from "react"
import { View, ViewStyle } from "react-native"
import { Button, Icon, Screen } from "@/components"
import BalanceHeader from "@/components/BalanceHeader"
import { TransactionsList } from "@/components/TransactionsList"
import { MainTabScreenProps } from "@/navigators"
import { useHeader } from "@/utils/useHeader"

interface WalletScreenProps extends MainTabScreenProps<"Wallet"> { }

export const WalletScreen: FC<WalletScreenProps> = observer(function WalletScreen({ navigation }) {
  return (
    <Screen
      style={$root}
      contentContainerStyle={$contentContainer}
      preset="fixed"
    >
      <View style={$topSection}>
        <BalanceHeader />
        <View style={$buttonRow}>
          <Button
            text="Send"
            onPress={() => {
              navigation.navigate("Send")
            }}
            style={$actionButton}
            LeftAccessory={(props) => (
              <Icon
                icon="arrow-upward"
                color="white"
                size={20}
                containerStyle={[$iconContainer, props.style]}
              />
            )}
          />
          <Button
            text="Receive"
            onPress={() => {
              navigation.navigate("Receive")
            }}
            style={$actionButton}
            LeftAccessory={(props) => (
              <Icon
                icon="arrow-downward"
                color="white"
                size={20}
                containerStyle={[$iconContainer, props.style]}
              />
            )}
          />
        </View>
      </View>

      <TransactionsList />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}

const $contentContainer: ViewStyle = {
  flex: 1,
  alignItems: "center",
}

const $topSection: ViewStyle = {
  width: "100%",
}

const $buttonRow: ViewStyle = {
  flexDirection: "row",
  justifyContent: "center",
  gap: 20,
  paddingHorizontal: 20,
}

const $actionButton: ViewStyle = {
  flex: 1,
  minWidth: 130,
}

const $iconContainer: ViewStyle = {
  marginRight: 8,
}
