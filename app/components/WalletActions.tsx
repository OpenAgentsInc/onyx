import { FC } from "react"
import { View, ViewStyle } from "react-native"
import { Button, Icon } from "@/components"
import { useNavigation } from "@react-navigation/native"

export const WalletActions: FC<{}> = () => {
  const navigation = useNavigation<any>()
  return (
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
  )
}

const $bottomSection: ViewStyle = {
  width: "100%",
  paddingHorizontal: 20,
  marginTop: "auto",
  marginBottom: 40,
}

const $bottomButton: ViewStyle = {
  marginBottom: 25,
}

const $iconContainer: ViewStyle = {
  marginRight: 8,
}
