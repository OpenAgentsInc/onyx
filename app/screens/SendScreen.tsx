import { FC, useState } from "react"
import { observer } from "mobx-react-lite" 
import { ViewStyle, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { Screen, Text } from "@/components"
import { useStores } from "@/models"

interface SendScreenProps extends AppStackScreenProps<"Send"> {}

export const SendScreen: FC<SendScreenProps> = observer(function SendScreen() {
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [isSending, setIsSending] = useState(false)
  const { walletStore } = useStores()

  const MIN_AMOUNT = 1000 // 1000 sats minimum

  const handleSend = async () => {
    if (!recipient.trim()) {
      walletStore.setError("Please enter an invoice or Lightning address")
      return
    }

    if (!amount.trim() || isNaN(Number(amount))) {
      walletStore.setError("Please enter a valid amount")
      return
    }

    const amountNum = Number(amount)
    if (amountNum < MIN_AMOUNT) {
      walletStore.setError(`Minimum amount is ${MIN_AMOUNT} sats`)
      return
    }

    setIsSending(true)
    try {
      const amountSats = Math.floor(amountNum)
      await walletStore.sendPayment(recipient.trim(), amountSats)
      // Clear form on success
      setRecipient("")
      setAmount("")
    } catch (error) {
      console.error("Send error:", error)
    } finally {
      setIsSending(false)
    }
  }

  const isValidInput = recipient.trim() && amount.trim() && !isNaN(Number(amount)) && Number(amount) >= MIN_AMOUNT

  return (
    <Screen style={$root} preset="scroll">
      <View style={$container}>
        <Text
          text="Send Payment"
          preset="heading"
          style={$heading}
        />
        
        <Text
          text="Enter a Lightning invoice or address"
          preset="subheading"
          style={$label}
        />

        <TextInput
          style={$input}
          placeholder="Lightning invoice or address..."
          placeholderTextColor="#666"
          value={recipient}
          onChangeText={setRecipient}
          multiline={true}
          numberOfLines={3}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isSending}
        />

        <Text
          text={`Amount (min. ${MIN_AMOUNT} sats)`}
          preset="subheading"
          style={$label}
        />

        <TextInput
          style={[$input, $amountInput]}
          placeholder="Amount in sats..."
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
          style={[$button, (!isValidInput || isSending) && $buttonDisabled]}
          onPress={handleSend}
          disabled={!isValidInput || isSending}
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

const $heading = {
  fontSize: 24,
  marginBottom: 20,
  textAlign: "center",
}

const $label = {
  marginBottom: 8,
  opacity: 0.8,
}

const $input = {
  backgroundColor: "#222",
  color: "#fff",
  padding: 12,
  borderRadius: 8,
  width: "100%",
  marginBottom: 16,
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
  marginTop: 8,
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