// Example data for OSINT / NIP-28 / NIP-32 demonstration

export const primaryChatMessage = {
  kind: 42,
  tags: [
    ["e", "channel_create_event_id_abc", "wss://relay.example.com", "root"],
    ["p", "abc1234_pubkey_...", "wss://relay.example.com"],
  ],
  content: `SPEAKER_00 (00:00 - 00:28) - "We see these unidentified drones all over the place.
    No one seems to know what's going on. Perfect for an OSINT approach..."`,
}

export const replyMessages = [
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

export const relatedOSINTEvents = [
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

export const labelEvents = [
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
