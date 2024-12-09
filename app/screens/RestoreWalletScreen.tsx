import { FC, useState } from "react"
import { observer } from "mobx-react-lite" 
import { ViewStyle, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { Screen, Text } from "@/components"
import { useStores } from "@/models"
import { useNavigation } from "@react-navigation/native"

interface RestoreWalletScreenProps extends AppStackScreenProps<"RestoreWallet"> {}

export const RestoreWalletScreen: FC<RestoreWalletScreenProps> = observer(function RestoreWalletScreen() {
  const [seedPhrase, setSeedPhrase] = useState("")
  const [isRestoring, setIsRestoring] = useState(false)
  const { walletStore } = useStores()
  const navigation = useNavigation()
  
  const handleRestore = async () => {
    if (!seedPhrase.trim()) {
      walletStore.setError("Please enter your seed phrase")
      return
    }

    setIsRestoring(true)
    try {
      const success = await walletStore.restoreWallet(seedPhrase.trim())
      if (success) {
        navigation.navigate("Main")
      }
    } catch (error) {
      console.error("Restore error:", error)
    } finally {
      setIsRestoring(false)
    }
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
          editable={!isRestoring}
        />
        
        {walletStore.error ? (
          <Text style={$errorText}>{walletStore.error}</Text>
        ) : null}

        <TouchableOpacity
          style={[$button, isRestoring && $buttonDisabled]}
          onPress={handleRestore}
          disabled={isRestoring}
        >
          {isRestoring ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={$buttonText}>
              Restore Wallet
            </Text>
          )}
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

const $buttonDisabled: ViewStyle = {
  opacity: 0.5,
}

const $buttonText = {
  color: "#fff",
  fontSize: 16,
  fontFamily: "JetBrainsMono-Regular",
}

const $errorText = {
  color: "#ff4444",
  fontSize: 14,
  marginBottom: 12,
  textAlign: "center",
}