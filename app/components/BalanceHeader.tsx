import { memo, ReactElement } from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import Money from "./Money"

/**
 * Displays the total available balance for the current wallet & network.
 */
const BalanceHeader = (): ReactElement => {
  const totalBalance = 600
  return (
    <View style={styles.container}>
      <View style={styles.label}>
        <Money
          sats={totalBalance}
          unitType="secondary"
          color="secondary"
          size="caption13Up"
          enableHide={true}
          symbol={true}
        />
      </View>
      <TouchableOpacity
        style={styles.balance}
        activeOpacity={0.7}
        testID="TotalBalance"
      // onPress={onSwitchUnit}
      >
        <Money sats={totalBalance} enableHide={true} symbol={true} />
      </TouchableOpacity>
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
