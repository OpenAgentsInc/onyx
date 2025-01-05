// data.ts
// Example data for OSINT items (custom kind=20001) plus other fields if needed

export interface OSINTEvent {
  kind: number
  id: string
  content: string
  tags: any[]
}

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

// You can also export any other data (chat messages, label events, etc.)
// that you're using in your main Test file.
