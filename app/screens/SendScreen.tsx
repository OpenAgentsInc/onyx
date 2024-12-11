import { FC, useState } from "react"
import { observer } from "mobx-react-lite" 
import { ViewStyle, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { Screen, Text } from "@/components"
import { useStores } from "@/models"

interface SendScreenProps extends AppStackScreenProps<"Send"> {}

export const SendScreen: FC<SendScreenProps> = observer(function SendScreen() {
  const [bolt11, setBolt11] = useState("")
  const [amount, setAmount] = useState("")
  const [isSending, setIsSending] = useState(false)
  const { walletStore } = useStores()

  const handleSend = async () => {
    if (!bolt11.trim()) {
      walletStore.setError("Please enter a payment invoice")
      return
    }

    if (!amount.trim() || isNaN(Number(amount))) {
      walletStore.setError("Please enter a valid amount")
      return
    }

    setIsSending(true)
    try {
      const amountSats = Math.floor(Number(amount))
      await walletStore.sendPayment(bolt11.trim(), amountSats)
      // Clear form on success
      setBolt11("")
      setAmount("")
    } catch (error) {
      console.error("Send error:", error)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Screen style={$root} preset="scroll">
      <View style={$container}>
        <TextInput
          style={$input}
          placeholder="Enter Lightning invoice..."
          placeholderTextColor="#666"
          value={bolt11}
          onChangeText={setBolt11}
          multiline={true}
          numberOfLines={3}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isSending}
        />

        <TextInput
          style={[$input, $amountInput]}
          placeholder="Amount (in sats)..."
          placeholderTextColor="#666"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isSending}
        />
        
        {walletStore.error ? (
          <Text style={$errorText}>{walletStore.error}</Text>
        ) : null}

        <TouchableOpacity
          style={[$button, isSending && $buttonDisabled]}
          onPress={handleSend}
          disabled={isSending}
        >
          {isSending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={$buttonText}>
              Send Payment
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
  textAlignVertical: "top",
}

const $amountInput = {
  height: 45,
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