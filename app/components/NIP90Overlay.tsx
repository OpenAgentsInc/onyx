import React, { useEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import { useNostrWebSocket } from "../services/nostr"

const NIP90Overlay = () => {
  const relayUrl = "wss://nostr-relay.example.com";
  const { connected, subscribe } = useNostrWebSocket(relayUrl);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (connected) {
      setStatus("connected");
      subscribe("example-subscription", [{ kinds: [1] }]); // Example subscription
    } else {
      setStatus("disconnected");
    }
  }, [connected]);

  return (
    <View style={styles.overlay}>
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>DVM Status: {status}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  statusText: {
    fontSize: 16,
    color: 'black',
  },
});

export default NIP90Overlay;
