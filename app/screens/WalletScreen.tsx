import { observer } from "mobx-react-lite"
import { FC } from "react"
import { View, ViewStyle } from "react-native"
import { Button, Icon, Screen } from "@/components"
import { BalanceDisplay } from "@/components/BalanceDisplay"
import BalanceHeader from "@/components/BalanceHeader"
import { useStores } from "@/models"
import { MainTabScreenProps } from "@/navigators"
import { useHeader } from "@/utils/useHeader"

interface WalletScreenProps extends MainTabScreenProps<"Wallet"> { }

export const WalletScreen: FC<WalletScreenProps> = observer(function WalletScreen({ navigation }) {
  const { walletStore } = useStores()

  useHeader({
    containerStyle: {
      // display: "none",
      backgroundColor: "black",
      // marginTop: 0
    },
    style: {
      display: "none",
    }
  })

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

      <View style={$bottomSection}>
        <Button
          text="Backup wallet"
          onPress={() => {
            navigation.navigate("BackupWallet")
          }}
          style={$bottomButton}
          LeftAccessory={(props) => (
            <Icon
              icon="backup"
              color="white"
              size={20}
              containerStyle={[$iconContainer, props.style]}
            />
          )}
        />
        <Button
          text="Restore wallet"
          onPress={() => {
            navigation.navigate("RestoreWallet")
          }}
          style={$bottomButton}
          LeftAccessory={(props) => (
            <Icon
              icon="restore"
              color="white"
              size={20}
              containerStyle={[$iconContainer, props.style]}
            />
          )}
        />
      </View>
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
}

const $topSection: ViewStyle = {
  width: "100%",
}

const $bottomSection: ViewStyle = {
  width: "100%",
  paddingHorizontal: 20,
  marginTop: "auto",
  marginBottom: 40,
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

const $bottomButton: ViewStyle = {
  marginBottom: 25,
}

const $iconContainer: ViewStyle = {
  marginRight: 8,
}
