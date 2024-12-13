import { observer } from "mobx-react-lite"
import React from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { pylonConfig } from "@/config/websocket"
import { useWebSocket } from "@/services/websocket/useWebSocket"
import { typography } from "@/theme"

const PylonOverlay = observer(() => {
  const { state } = useWebSocket(pylonConfig);

  if (!state.connected) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          {state.connecting ? 'Connecting to Pylon...' : 'Disconnected from Pylon'}
        </Text>
        {state.error && (
          <Text style={styles.errorText}>{state.error}</Text>
        )}
        {!state.connecting && (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              // This will trigger a reconnection attempt
              window.location.reload();
            }}
          >
            <Text style={styles.retryText}>Retry Connection</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // When connected, show a minimal status indicator
  return (
    <View style={styles.connectedContainer}>
      <View style={styles.statusDot} />
      <Text style={styles.connectedText}>Connected to Pylon</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000aa',
    padding: 10,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: 5,
  },
  retryButton: {
    marginTop: 10,
    backgroundColor: '#444',
    padding: 8,
    borderRadius: 4,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
  },
  connectedContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00000077',
    padding: 8,
    borderRadius: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#44ff44',
    marginRight: 6,
  },
  connectedText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: typography.primary.light
  },
});

export default PylonOverlay;
export { PylonOverlay };
