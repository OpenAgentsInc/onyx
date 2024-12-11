import { observer } from "mobx-react-lite"
import { FC } from "react"
import {
  ScrollView, TextStyle, TouchableOpacity, View, ViewStyle
} from "react-native"
import { Button, Screen, Text } from "@/components"
import { BalanceDisplay } from "@/components/BalanceDisplay"
import BalanceHeader from "@/components/BalanceHeader"
import { useStores } from "@/models"
import { MainTabScreenProps } from "@/navigators"

interface WalletScreenProps extends MainTabScreenProps<"Wallet"> { }

export const WalletScreen: FC<WalletScreenProps> = observer(function WalletScreen({ navigation }) {
  const { walletStore } = useStores()
  const { isInitialized, recentTransactions } = walletStore

  return (
    <Screen
      style={$root}
      contentContainerStyle={$contentContainer}
      preset="fixed"
    >
      <BalanceHeader />

      <Button
        text="Backup wallet"
        onPress={() => {
          navigation.navigate("BackupWallet")
        }}
        style={{ marginBottom: 25, width: 300 }}
      />
      <Button
        text="Restore wallet"
        onPress={() => {
          navigation.navigate("RestoreWallet")
        }}
        style={{ marginBottom: 50, width: 300 }}
      />

      {/* {isInitialized && (
        <View style={$transactionsContainer}>
          <Text text="Recent Transactions" style={$sectionHeader} />
          <ScrollView style={$transactionsList}>
            {recentTransactions.length === 0 ? (
              <Text text="No transactions yet" style={$emptyText} />
            ) : (
              recentTransactions.map((tx) => (
                <TouchableOpacity key={tx.id} style={$transactionItem}>
                  <View style={$transactionLeft}>
                    <Text
                      text={tx.type === "send" ? "Sent" : "Received"}
                      style={[$transactionType, tx.type === "send" ? $sendText : $receiveText]}
                    />
                    <Text
                      text={new Date(tx.timestamp).toLocaleDateString()}
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
      )} */}
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
  paddingTop: 20,
}

const $headerText: TextStyle = {
  color: "white",
  fontSize: 24,
  marginBottom: 20,
  fontFamily: "SpaceGrotesk-Bold",
}

const $transactionsContainer: ViewStyle = {
  flex: 1,
  width: "100%",
  paddingHorizontal: 16,
  marginTop: 20,
}

const $sectionHeader: TextStyle = {
  color: "white",
  fontSize: 18,
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

const $transactionType: TextStyle = {
  fontSize: 16,
  marginBottom: 4,
  fontFamily: "SpaceGrotesk-Medium",
}

const $transactionDate: TextStyle = {
  color: "#888",
  fontSize: 14,
  fontFamily: "SpaceGrotesk-Regular",
}

const $transactionAmount: TextStyle = {
  fontSize: 16,
  fontFamily: "SpaceGrotesk-Medium",
}

const $sendText: TextStyle = {
  color: "#ff4444",
}

const $receiveText: TextStyle = {
  color: "#44ff44",
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
