import { memo, ReactElement, useEffect } from "react"
import { ActivityIndicator, StyleSheet, View } from "react-native"
import { useStores } from "@/models"
import Money from "./Money"
import { Text } from "./Text"

/**
 * Displays the total available balance for the current wallet & network.
 */
const BalanceHeader = (): ReactElement => {
  const { walletStore } = useStores()
  const {
    balanceSat,
    pendingSendSat,
    pendingReceiveSat,
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
      }, 5000) // 5 seconds

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

        {(pendingSendSat > 0 || pendingReceiveSat > 0) && (
          <View style={styles.pendingContainer}>
            {pendingSendSat > 0 && (
              <Text style={styles.pendingText}>
                Sending: {pendingSendSat.toLocaleString()} sats
              </Text>
            )}
            {pendingReceiveSat > 0 && (
              <Text style={styles.pendingText}>
                Receiving: {pendingReceiveSat.toLocaleString()} sats
              </Text>
            )}
          </View>
        )}
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
  },
  pendingContainer: {
    marginTop: 12,
    alignItems: "center",
  },
  pendingText: {
    color: "#888",
    fontSize: 14,
    fontFamily: "JetBrainsMono-Regular",
    marginVertical: 2,
  }
})

export default memo(BalanceHeader)
