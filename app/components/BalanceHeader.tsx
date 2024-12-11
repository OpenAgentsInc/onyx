import { memo, ReactElement, useEffect } from "react"
import { StyleSheet, View } from "react-native"
import { useStores } from "@/models"
import Money from "./Money"

/**
 * Displays the total available balance for the current wallet & network.
 */
const BalanceHeader = (): ReactElement => {
  const { walletStore } = useStores()
  const {
    balanceSat,
    isInitialized,
    error,
    fetchBalanceInfo
  } = walletStore

  // Fetch balance on mount and every 30 seconds
  useEffect(() => {
    if (isInitialized && !error) {
      // Initial fetch
      fetchBalanceInfo()

      // Set up periodic refresh
      const interval = setInterval(() => {
        fetchBalanceInfo()
      }, 30000) // 30 seconds

      return () => clearInterval(interval)
    }
  }, [isInitialized, error, fetchBalanceInfo])

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
    marginVertical: 48
  },
  balance: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default memo(BalanceHeader);