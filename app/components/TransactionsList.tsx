import { observer } from "mobx-react-lite"
import { FC } from "react"
import {
  ScrollView, TextStyle, TouchableOpacity, View, ViewStyle
} from "react-native"
import { Text } from "@/components"
import { useStores } from "@/models"
import { colors } from "@/theme/colorsDark"

export const TransactionsList: FC = observer(function TransactionsList() {
  const { walletStore } = useStores()
  const { isInitialized, recentTransactions } = walletStore

  if (!isInitialized) return null

  return (
    <View style={$transactionsContainer}>
      <Text text="Recent Transactions" style={$sectionHeader} />
      <ScrollView style={$transactionsList}>
        {recentTransactions.length === 0 ? (
          <Text text="No transactions yet" style={$emptyText} />
        ) : (
          recentTransactions.map((tx) => (
            <TouchableOpacity key={tx.id} style={$transactionItem} activeOpacity={1}>
              <View style={$transactionLeft}>
                <Text
                  text={tx.type === "send" ? "Sent" : "Received"}
                  style={[$transactionType, tx.type === "send" ? $sendText : $receiveText]}
                />
                <Text
                  text={new Date(tx.timestamp * 1000).toLocaleDateString()}
                  style={$transactionDate}
                />
              </View>
              <View style={$transactionRight}>
                <Text
                  text={`${tx.type === "send" ? "-" : "+"}${tx.amount.toLocaleString()} sats`}
                  style={[$transactionAmount, tx.type === "send" ? $sendText : $receiveText]}
                />
                {tx.status === "pending" && (
                  <Text text="Pending" style={$pendingText} />
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  )
})

const $transactionsContainer: ViewStyle = {
  flex: 1,
  width: "100%",
  paddingHorizontal: 16,
  marginTop: 20,
}

const $sectionHeader: TextStyle = {
  color: "white",
  fontSize: 18,
  marginTop: 14,
  marginBottom: 12,
  fontFamily: "SpaceGrotesk-Medium",
}

const $transactionsList: ViewStyle = {
  flex: 1,
}

const $transactionItem: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderBottomColor: "#333",
}

const $transactionLeft: ViewStyle = {
  flex: 1,
}

const $transactionRight: ViewStyle = {
  alignItems: "flex-end",
}

// And update these style constants:
const $transactionType: TextStyle = {
  fontSize: 16,
  marginBottom: 4,
  fontFamily: "SpaceGrotesk-Medium",
  color: "white", // Added this
}

const $transactionDate: TextStyle = {
  color: "#888",
  fontSize: 14,
  fontFamily: "SpaceGrotesk-Regular",
}

const $transactionAmount: TextStyle = {
  fontSize: 16,
  fontFamily: "SpaceGrotesk-Medium",
  color: "white", // Added this
}

const $sendText: TextStyle = {
  color: 'white',
}

const $receiveText: TextStyle = {
  color: "white", // Changed from green to white
}

const $pendingText: TextStyle = {
  color: "#888",
  fontSize: 12,
  marginTop: 4,
  fontFamily: "SpaceGrotesk-Regular",
}

const $emptyText: TextStyle = {
  color: "#888",
  fontSize: 16,
  textAlign: "center" as const,
  marginTop: 20,
  fontFamily: "SpaceGrotesk-Regular",
}
