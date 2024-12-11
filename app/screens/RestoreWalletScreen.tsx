import { FC, useState } from "react"
import { observer } from "mobx-react-lite" 
import { ViewStyle, TextInput, TouchableOpacity, View } from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { Screen, Text } from "@/components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models" 

interface RestoreWalletScreenProps extends AppStackScreenProps<"RestoreWallet"> {}

export const RestoreWalletScreen: FC<RestoreWalletScreenProps> = observer(function RestoreWalletScreen() {
  const [seedPhrase, setSeedPhrase] = useState("")
  
  const handleRestore = () => {
    // TODO: Implement wallet restoration logic
    console.log("Restoring wallet with seed phrase:", seedPhrase)
  }

  return (
    <Screen style={$root} preset="scroll">
      <View style={$container}>
        <TextInput
          style={$input}
          placeholder="Enter your 12-word seed phrase..."
          placeholderTextColor="#666"
          value={seedPhrase}
          onChangeText={setSeedPhrase}
          multiline={true}
          numberOfLines={2}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={$button}
          onPress={handleRestore}
        >
          <Text style={$buttonText}>
            Restore Wallet
          </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}

const $container: ViewStyle = {
  padding: 20,
  width: "100%",
  maxWidth: 400,
  alignSelf: "center",
}

const $input = {
  backgroundColor: "#222",
  color: "#fff",
  padding: 12,
  borderRadius: 8,
  width: "100%",
  marginBottom: 12,
  fontFamily: "JetBrainsMono-Regular",
  height: 80,
  textAlignVertical: "top",
}

const $button: ViewStyle = {
  backgroundColor: "#333",
  padding: 16,
  borderRadius: 8,
  width: "100%",
  alignItems: "center",
}

const $buttonText = {
  color: "#fff",
  fontSize: 16,
  fontFamily: "JetBrainsMono-Regular",
}