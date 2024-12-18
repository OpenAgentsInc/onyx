import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function MarketplaceScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Marketplace Screen</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    minHeight: 500,
    maxWidth: 800,
    marginHorizontal: 'auto',
  },
  text: {
    color: '#fff',
    fontFamily: 'jetBrainsMonoRegular',
  }
})