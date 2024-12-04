import React, { useEffect } from "react"
import { View, StyleSheet } from "react-native"
import { Text } from "./Text"
import { useStores } from "../models"
import { useBreez } from "../providers/BreezProvider"
import { observer } from "mobx-react-lite"
import { getInfo } from '@breeztech/react-native-breez-sdk-liquid'

export const BalanceDisplay = observer(function BalanceDisplay() {
  const {
    walletStore: { balanceSat, pendingSendSat, pendingReceiveSat, setBalance, setPendingSend, setPendingReceive },
  } = useStores()
  const { isInitialized } = useBreez()

  useEffect(() => {
    async function updateBalance() {
      if (!isInitialized) return

      try {
        const info = await getInfo()
        setBalance(info.balanceSat)
        setPendingSend(info.pendingSendSat)
        setPendingReceive(info.pendingReceiveSat)
      } catch (error) {
        console.error("Error fetching balance:", error)
      }
    }

    updateBalance()
    // Set up an interval to update the balance periodically
    const interval = setInterval(updateBalance, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [isInitialized, setBalance, setPendingSend, setPendingReceive])

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
  },
  balanceText: {
    color: "#fff",
    fontSize: 24,
  },
  pendingContainer: {
    marginTop: 10,
  },
  pendingText: {
    color: "#888",
    fontSize: 14,
  },
})