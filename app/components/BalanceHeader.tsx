import { memo, ReactElement, useEffect } from "react"
import { StyleSheet, View, ActivityIndicator } from "react-native"
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

  // Fetch balance on mount and every 10 seconds
  useEffect(() => {
    if (isInitialized && !error) {
      console.log("[BalanceHeader] Initial balance fetch")
      fetchBalanceInfo()

      // Set up periodic refresh
      const interval = setInterval(() => {
        console.log("[BalanceHeader] Periodic balance fetch")
        fetchBalanceInfo()
      }, 10000) // 10 seconds

      return () => clearInterval(interval)
    }
  }, [isInitialized, error, fetchBalanceInfo])

  if (!isInitialized) {
    return (
      <View style={[styles.container, styles.loading]}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    )
  }

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
  loading: {
    alignItems: "center",
    justifyContent: "center",
  }
});

export default memo(BalanceHeader);