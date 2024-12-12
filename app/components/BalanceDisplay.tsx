import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"
import { ActivityIndicator, StyleSheet, View } from "react-native"
import { useStores } from "../models"
import { Text } from "./Text"

export const BalanceDisplay = observer(function BalanceDisplay() {
  const { walletStore } = useStores()
  const {
    balanceSat,
    pendingSendSat,
    pendingReceiveSat,
    isInitialized,
    error,
    fetchBalanceInfo
  } = walletStore

  useEffect(() => {
    if (isInitialized) {
      fetchBalanceInfo()
      // Set up an interval to update the balance periodically
      const interval = setInterval(fetchBalanceInfo, 15000) // Every 15 seconds
      return () => clearInterval(interval)
    }
    return undefined // Add explicit return
  }, [isInitialized, fetchBalanceInfo])

  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.statusText}>Initializing wallet...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.balanceText} preset="heading">
        {balanceSat.toLocaleString()} sats
      </Text>
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
  )
})

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#000",
    borderRadius: 10,
    margin: 10,
    minHeight: 100,
    justifyContent: "center",
  },
  balanceText: {
    color: "#fff",
    fontSize: 24,
    fontFamily: "SpaceGrotesk-Bold",
  },
  pendingContainer: {
    marginTop: 10,
  },
  pendingText: {
    color: "#888",
    fontSize: 14,
    fontFamily: "SpaceGrotesk-Regular",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 14,
    fontFamily: "SpaceGrotesk-Regular",
    textAlign: "center",
  },
  statusText: {
    color: "#888",
    fontSize: 14,
    fontFamily: "SpaceGrotesk-Regular",
    marginTop: 10,
  },
})
