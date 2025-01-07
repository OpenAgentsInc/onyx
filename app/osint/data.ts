// data.ts
// Example data for demonstrating OSINT events, chat messages, label events, etc.

/**
 * OSINTEvent: a custom kind=20001 data structure
 * - kind: number
 * - id: string
 * - content: JSON-encoded string with "title", "description", "source", "confidence", etc.
 * - tags: a list of arrays, e.g. [ ["t","claim-analysis"], ["osint-category", "analysis"] ]
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
 * Analysis of Shawn Ryan Show interview with Sam Shoemate
 */
export const relatedOSINTEvents: OSINTEvent[] = [
  {
    kind: 20001,
    id: "abcdef123456...",
    content: `{
      "title": "Email Authentication Analysis",
      "description": "Technical analysis of the alleged Livelsberger email headers and metadata shows inconsistencies with standard military email systems.",
      "source": "Email header analysis, DMARC records, military email standards",
      "confidence": "high"
    }`,
    tags: [
      ["t", "email-verification"],
      ["osint-category", "technical-analysis"],
      ["credibility", "disputed"]
    ],
  },
  {
    kind: 20001,
    id: "xyz789...",
    content: `{
      "title": "Timeline Inconsistencies",
      "description": "Multiple discrepancies found between Shoemate's account of events and verified public records of military operations.",
      "source": "Public military records, news archives, official statements",
      "confidence": "high"
    }`,
    tags: [
      ["t", "timeline-analysis"],
      ["osint-category", "fact-checking"],
      ["credibility", "contradicted"]
    ],
  },
  {
    kind: 20001,
    id: "def456...",
    content: `{
      "title": "Drone Technology Claims Analysis",
      "description": "Claims about 'gravitic propulsion systems' contradict known physics principles and current military capabilities.",
      "source": "Defense technology reports, physics research papers, expert consultations",
      "confidence": "very-high"
    }`,
    tags: [
      ["t", "technology-verification"],
      ["osint-category", "technical-analysis"],
      ["credibility", "highly-unlikely"]
    ],
  }
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
  content: `SPEAKER_00 (00:00 - 00:28) - "Let's analyze the recent Shawn Ryan Show interview with Sam Shoemate. Several claims need verification."`,
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
    content: `The email authentication doesn't match standard military protocols. Several red flags in the header structure and routing information.`,
  },
  {
    kind: 42,
    tags: [
      ["e", "channel_create_event_id_abc", "wss://relay.example.com", "root"],
      ["e", "primaryChatMessage_id_123", "wss://relay.example.com", "reply"],
      ["p", "ghi999_pubkey_...", "wss://relay.example.com"],
    ],
    content: `Claims about advanced drone technology using 'gravitic propulsion' don't align with any known physics principles or current military capabilities.`,
  },
  {
    kind: 42,
    tags: [
      ["e", "channel_create_event_id_abc", "wss://relay.example.com", "root"],
      ["e", "primaryChatMessage_id_123", "wss://relay.example.com", "reply"],
      ["p", "jkl000_pubkey_...", "wss://relay.example.com"],
    ],
    content: `The timeline presented in the interview has multiple inconsistencies with verified public records and official military operation logs.`,
  }
]

/**
 * Example Label Events (NIP-32, kind=1985).
 * Labels for credibility assessment of claims
 */
export const labelEvents: LabelEvent[] = [
  {
    kind: 1985,
    tags: [
      ["L", "credibility-assessment"],
      ["l", "disputed", "credibility-level"],
      ["e", "abcdef123456...", "wss://relay.example.com"],
    ],
    content: "Email authentication analysis reveals significant technical inconsistencies.",
  },
  {
    kind: 1985,
    tags: [
      ["L", "credibility-assessment"],
      ["l", "highly-unlikely", "credibility-level"],
      ["e", "def456...", "wss://relay.example.com"],
    ],
    content: "Technical claims contradict established physics and known military capabilities.",
  },
  {
    kind: 1985,
    tags: [
      ["L", "credibility-assessment"],
      ["l", "contradicted", "credibility-level"],
      ["e", "xyz789...", "wss://relay.example.com"],
    ],
    content: "Multiple timeline discrepancies with verified public records.",
  }
]