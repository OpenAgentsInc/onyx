import { FC, useState } from "react"
import { observer } from "mobx-react-lite" 
import { ViewStyle, TextInput, TouchableOpacity, View, ActivityIndicator, Text as RNText } from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { Screen, Text } from "@/components"
import { useStores } from "@/models"

interface SendScreenProps extends AppStackScreenProps<"Send"> {}

export const SendScreen: FC<SendScreenProps> = observer(function SendScreen() {
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [fees, setFees] = useState<number | null>(null)
  const { walletStore } = useStores()

  const handleSend = async () => {
    if (!recipient.trim()) {
      walletStore.setError("Please enter an invoice or Lightning address")
      return
    }

    if (!amount.trim() || isNaN(Number(amount))) {
      walletStore.setError("Please enter a valid amount")
      return
    }

    setIsSending(true)
    try {
      const amountSats = Math.floor(Number(amount))
      await walletStore.sendPayment(recipient.trim(), amountSats)
      // Clear form on success
      setRecipient("")
      setAmount("")
      setFees(null)
    } catch (error) {
      console.error("Send error:", error)
    } finally {
      setIsSending(false)
    }
  }

  const isValidInput = recipient.trim() && amount.trim() && !isNaN(Number(amount))

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
          text="Amount (in sats)"
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

        {fees !== null && (
          <Text
            text={`Network fee: ${fees} sats`}
            style={$feesText}
          />
        )}
        
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

        <View style={$helpContainer}>
          <Text text="Supported formats:" style={$helpTitle} />
          <RNText style={$helpText}>• BOLT11 invoice</RNText>
          <RNText style={$helpText}>• Lightning Address (user@domain.com)</RNText>
          <RNText style={$helpText}>• LNURL</RNText>
        </View>
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

const $feesText = {
  color: "#999",
  fontSize: 14,
  marginBottom: 12,
  textAlign: "center",
}

const $helpContainer = {
  marginTop: 24,
  padding: 16,
  backgroundColor: "#222",
  borderRadius: 8,
}

const $helpTitle = {
  marginBottom: 8,
  opacity: 0.8,
}

const $helpText = {
  color: "#999",
  fontSize: 14,
  marginBottom: 4,
  fontFamily: "JetBrainsMono-Regular",
}