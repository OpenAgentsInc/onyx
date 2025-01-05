// data.ts
// Example data for demonstrating OSINT events, chat messages, label events, etc.

/**
 * OSINTEvent: a custom kind=20001 data structure
 * - kind: number
 * - id: string
 * - content: JSON-encoded string with "title", "description", "source", "confidence", etc.
 * - tags: a list of arrays, e.g. [ ["t","drone-sighting"], ["osint-category", "analysis"] ]
 */
export interface OSINTEvent {
  kind: number
  id: string
  content: string
  tags: any[]
}

/**
 * Basic interface for a chat message (like NIP-28 kind=42).
 */
export interface ChatMessage {
  kind: number
  tags: any[]
  content: string
}

/**
 * Basic interface for a label event (NIP-32 kind=1985).
 */
export interface LabelEvent {
  kind: number
  tags: any[]
  content: string
}

/**
 * Example OSINT events (kind=20001).
 * You can have as many items here as you want.
 */
export const relatedOSINTEvents: OSINTEvent[] = [
  {
    kind: 20001,
    id: "abcdef123456...",
    content: `{
      "title": "Drone Sighting Details",
      "description": "Footage captured at 10pm near highway overpass...",
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
      "description": "Conflicting official statements vs. local authorities.",
      "source": "Interview excerpt, social media chatter",
      "confidence": "high"
    }`,
    tags: [
      ["t", "government"],
      ["osint-category", "analysis"],
    ],
  },
]

/**
 * Example primary chat message (NIP-28, kind=42)
 */
export const primaryChatMessage: ChatMessage = {
  kind: 42,
  tags: [
    ["e", "channel_create_event_id_abc", "wss://relay.example.com", "root"],
    ["p", "abc1234_pubkey_...", "wss://relay.example.com"],
  ],
  content: `SPEAKER_00 (00:00 - 00:28) - "We see these unidentified drones all over the place.
    No one seems to know what's going on. Perfect for an OSINT approach..."`,
}

/**
 * Example reply messages (NIP-28, kind=42)
 */
export const replyMessages: ChatMessage[] = [
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

/**
 * Example Label Events (NIP-32, kind=1985).
 * You might label certain OSINT events as "verified", "contradictory", etc.
 */
export const labelEvents: LabelEvent[] = [
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
