import React from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import { Text } from "@/components"

/**
 * Example detail view that shows:
 * 1. A NIP-28 channel message (kind=42) referencing a podcast transcript.
 * 2. Associated OSINT events (custom kind=20001).
 * 3. Example NIP-28 **reply** messages.
 * 4. Example NIP-32 **label** events (kind=1985).
 *
 * Styled with a dark background and white text, plus "cards" for each section.
 */
export function Test() {
  // Primary chat message (NIP-28, kind=42)
  const primaryChatMessage = {
    kind: 42,
    tags: [
      ["e", "channel_create_event_id_abc", "wss://relay.example.com", "root"],
      ["p", "abc1234_pubkey_...", "wss://relay.example.com"],
    ],
    content: `SPEAKER_00 (00:00 - 00:28) - "We see these unidentified drones all over the place.
      No one seems to know what's going on. Perfect for an OSINT approach..."`,
  }

  // Replies (NIP-28, kind=42), referencing the above message
  const replyMessages = [
    {
      kind: 42,
      tags: [
        ["e", "channel_create_event_id_abc", "wss://relay.example.com", "root"],
        ["e", "primaryChatMessage_id_123", "wss://relay.example.com", "reply"],
        ["p", "def5678_pubkey_...", "wss://relay.example.com"],
      ],
      content: `Interesting. I've seen reports from multiple states. Let's label them "verified sightings" if we have enough sources.`,
    },
    {
      kind: 42,
      tags: [
        ["e", "channel_create_event_id_abc", "wss://relay.example.com", "root"],
        ["e", "primaryChatMessage_id_123", "wss://relay.example.com", "reply"],
        ["p", "ghi999_pubkey_...", "wss://relay.example.com"],
      ],
      content: `We should also gather official statements. Some folks say it's "friendly fire" from government agencies. Let's see.`,
    },
  ]

  // OSINT events (custom kind=20001)
  const relatedOSINTEvents = [
    {
      kind: 20001,
      id: "abcdef123456...",
      content: `{
        "title": "Drone Sighting Details",
        "description": "Footage captured at 10pm local time, near a highway overpass...",
        "source": "Podcast mention, user-submitted video",
        "confidence": "medium"
      }`,
      tags: [
        ["t", "drone-sighting"],
        ["osint-category", "equipment"],
      ],
    },
    {
      kind: 20001,
      id: "xyz789...",
      content: `{
        "title": "Possible Gov't Surveillance",
        "description": "Conflicting official statements from local authorities vs. federal agencies.",
        "source": "Interview excerpt, social media chatter",
        "confidence": "high"
      }`,
      tags: [
        ["t", "government"],
        ["osint-category", "analysis"],
      ],
    },
  ]

  // NIP-32 Label events (kind=1985) referencing OSINT event IDs
  const labelEvents = [
    {
      kind: 1985,
      tags: [
        ["L", "trust-level"],
        ["l", "verified", "trust-level"],
        ["e", "abcdef123456...", "wss://relay.example.com"],
      ],
      content: "Cross-referenced 3 independent eyewitness accounts.",
    },
    {
      kind: 1985,
      tags: [
        ["L", "trust-level"],
        ["l", "contradictory", "trust-level"],
        ["e", "xyz789...", "wss://relay.example.com"],
      ],
      content: "Inconsistent with official statement from DHS. Needs further review.",
    },
  ]

  return (
    <ScrollView style={styles.container}>
      {/* Primary Chat Message */}
      <View style={styles.card}>
        <Text style={styles.heading}>Primary Chat Message</Text>
        <Text style={styles.textWhite}>Kind: {primaryChatMessage.kind}</Text>
        <Text style={styles.textWhite}>Tags: {JSON.stringify(primaryChatMessage.tags)}</Text>
        <Text style={[styles.textWhite, styles.subheading]}>Transcript Excerpt</Text>
        <Text style={styles.textWhite}>{primaryChatMessage.content}</Text>
      </View>

      {/* Reply Messages */}
      <View style={styles.card}>
        <Text style={styles.heading}>Replies</Text>
        {replyMessages.map((reply, index) => (
          <View key={`reply_${index}`} style={styles.replyCard}>
            <Text style={[styles.textWhite, styles.subheading]}>Reply #{index + 1}</Text>
            <Text style={styles.textWhite}>Kind: {reply.kind}</Text>
            <Text style={styles.textWhite}>Tags: {JSON.stringify(reply.tags)}</Text>
            <Text style={styles.textWhite}>{reply.content}</Text>
          </View>
        ))}
      </View>

      {/* OSINT Events */}
      <View style={styles.card}>
        <Text style={styles.heading}>Associated OSINT Events</Text>
        {relatedOSINTEvents.map((osintEvent, index) => (
          <View key={osintEvent.id} style={styles.replyCard}>
            <Text style={[styles.textWhite, styles.subheading]}>OSINT Event #{index + 1}</Text>
            <Text style={styles.textWhite}>Kind: {osintEvent.kind}</Text>
            <Text style={styles.textWhite}>ID: {osintEvent.id}</Text>
            <Text style={styles.textWhite}>Tags: {JSON.stringify(osintEvent.tags)}</Text>
            <Text style={styles.textWhite}>Content: {osintEvent.content}</Text>
          </View>
        ))}
      </View>

      {/* Label Events (NIP-32) */}
      <View style={styles.card}>
        <Text style={styles.heading}>Label Events (NIP-32)</Text>
        {labelEvents.map((lblEvent, index) => (
          <View key={`label_${index}`} style={styles.replyCard}>
            <Text style={[styles.textWhite, styles.subheading]}>Label Event #{index + 1}</Text>
            <Text style={styles.textWhite}>Kind: {lblEvent.kind}</Text>
            <Text style={styles.textWhite}>Tags: {JSON.stringify(lblEvent.tags)}</Text>
            <Text style={styles.textWhite}>Content: {lblEvent.content}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Black background
    padding: 16,
  },
  card: {
    backgroundColor: "#333", // Dark gray cards
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  replyCard: {
    backgroundColor: "#444",
    borderRadius: 6,
    padding: 8,
    marginVertical: 6,
  },
  heading: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  subheading: {
    marginVertical: 6,
    fontWeight: "600",
  },
  textWhite: {
    color: "#FFF",
  },
})
