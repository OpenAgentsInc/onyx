import { memo, ReactElement } from "react"
import { StyleSheet, View } from "react-native"
import { useStores } from "@/models"
import Money from "./Money"

/**
 * Displays the total available balance for the current wallet & network.
 */
const BalanceHeader = (): ReactElement => {
  const totalBalance = 600
  const { walletStore } = useStores()
  const {
    balanceSat,
    pendingSendSat,
    pendingReceiveSat,
    isInitialized,
    error,
    fetchBalanceInfo
  } = walletStore
  return (
    <View style={styles.container}>
      <View style={styles.balance}>
        <Money sats={balanceSat} symbol={true} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 32,
    marginBottom: 24,
  },
  balance: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default memo(BalanceHeader);