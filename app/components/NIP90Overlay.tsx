// app/components/NIP90Overlay.tsx
import { observer } from "mobx-react-lite"
import React, { useEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"

const NIP90Overlay = observer(() => {
  const [status, setStatus] = useState('idle'); // Status can be updated based on app state

  useEffect(() => {
    // Placeholder for any setup logic, such as initializing connection to DVM or relay
    setStatus('connected'); // Example: update status when connection is established
  }, []);

  return (
    <View style={styles.overlay}>
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>DVM Status: {status}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark overlay background
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'white', // Box for displaying status
  },
  statusText: {
    fontSize: 16,
    color: 'black',
  },
});

export default NIP90Overlay;
