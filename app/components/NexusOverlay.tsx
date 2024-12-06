import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { websocketConfig } from '@/config/websocket';
import { useWebSocket } from '@/services/websocket/useWebSocket';

const NexusOverlay = observer(() => {
  const { state } = useWebSocket(websocketConfig);

  if (!state.connected) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          {state.connecting ? 'Connecting to Nexus...' : 'Disconnected from Nexus'}
        </Text>
        {state.error && (
          <Text style={styles.errorText}>{state.error}</Text>
        )}
      </View>
    );
  }

  return null;
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
});

export default NexusOverlay;