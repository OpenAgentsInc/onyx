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
      <Money sats={balanceSat} symbol={true} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 32,
    paddingHorizontal: 16,
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balance: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default memo(BalanceHeader);
