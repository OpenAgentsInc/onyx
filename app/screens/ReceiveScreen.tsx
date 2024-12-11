import { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, TextInput, TouchableOpacity, View, ActivityIndicator, Share } from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { Screen, Text } from "@/components"
import { useStores } from "@/models"
import Clipboard from "@react-native-clipboard/clipboard"

interface ReceiveScreenProps extends AppStackScreenProps<"Receive"> {}

export const ReceiveScreen: FC<ReceiveScreenProps> = observer(function ReceiveScreen() {
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [invoice, setInvoice] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const { walletStore } = useStores()

  const MIN_AMOUNT = 1000 // 1000 sats minimum

  const handleGenerate = async () => {
    if (!amount.trim() || isNaN(Number(amount))) {
      walletStore.setError("Please enter a valid amount")
      return
    }

    const amountNum = Number(amount)
    if (amountNum < MIN_AMOUNT) {
      walletStore.setError(`Minimum amount is ${MIN_AMOUNT} sats`)
      return
    }

    setIsGenerating(true)
    try {
      const bolt11 = await walletStore.receivePayment(
        Math.floor(amountNum),
        description.trim() || undefined
      )
      setInvoice(bolt11)
      walletStore.setError(null)
    } catch (error) {
      console.error("Generate invoice error:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    if (invoice) {
      Clipboard.setString(invoice)
    }
  }

  const handleShare = async () => {
    if (invoice) {
      try {
        await Share.share({
          message: invoice,
        })
      } catch (error) {
        console.error("Share error:", error)
      }
    }
  }

  const handleClear = () => {
    setAmount("")
    setDescription("")
    setInvoice("")
    walletStore.setError(null)
  }

  const isValidAmount = amount.trim() && !isNaN(Number(amount)) && Number(amount) >= MIN_AMOUNT

  return (
    <Screen style={$root} preset="scroll">
      <View style={$container}>
        <Text
          text="Receive Payment"
          preset="heading"
          style={$heading}
        />

        {!invoice ? (
          <>
            <Text
              text={`Amount (min. ${MIN_AMOUNT} sats)`}
              preset="subheading"
              style={$label}
            />
            <TextInput
              style={[$input, $amountInput]}
              placeholder={`Amount (min. ${MIN_AMOUNT} sats)...`}
              placeholderTextColor="#666"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isGenerating}
            />

            <Text
              text="Description (optional)"
              preset="subheading"
              style={$label}
            />
            <TextInput
              style={$input}
              placeholder="Payment description..."
              placeholderTextColor="#666"
              value={description}
              onChangeText={setDescription}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isGenerating}
            />

            {walletStore.error ? (
              <Text style={$errorText}>{walletStore.error}</Text>
            ) : null}

            <TouchableOpacity
              style={[$button, (!isValidAmount || isGenerating) && $buttonDisabled]}
              onPress={handleGenerate}
              disabled={!isValidAmount || isGenerating}
            >
              {isGenerating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={$buttonText}>
                  Generate Invoice
                </Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <View style={$invoiceContainer}>
            <Text
              text="Invoice Generated"
              preset="subheading"
              style={$label}
            />
            
            <View style={$invoiceBox}>
              <Text style={$invoiceText} numberOfLines={3}>
                {invoice}
              </Text>
            </View>

            <View style={$buttonRow}>
              <TouchableOpacity
                style={[$button, $smallButton]}
                onPress={handleCopy}
              >
                <Text style={$buttonText}>Copy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[$button, $smallButton]}
                onPress={handleShare}
              >
                <Text style={$buttonText}>Share</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[$button, $clearButton]}
              onPress={handleClear}
            >
              <Text style={$buttonText}>Generate New Invoice</Text>
            </TouchableOpacity>
          </View>
        )}
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

const $invoiceContainer: ViewStyle = {
  width: "100%",
}

const $invoiceBox = {
  backgroundColor: "#222",
  padding: 16,
  borderRadius: 8,
  marginBottom: 16,
}

const $invoiceText = {
  color: "#fff",
  fontFamily: "JetBrainsMono-Regular",
  fontSize: 12,
}

const $buttonRow: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 16,
}

const $smallButton: ViewStyle = {
  flex: 0.48,
}

const $clearButton: ViewStyle = {
  backgroundColor: "#444",
  marginTop: 16,
}