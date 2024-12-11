# Feed Screen Documentation

## Overview
The Feed screen displays a list of NIP89 service announcements and NIP90 job requests in a unified feed. It uses a black-and-white theme consistent with the app's futuristic HUD aesthetic.

## Component Structure
```
HomeScreen (fixed preset)
├── Header ("Nostr Feed")
└── Feed
    └── FlatList
        └── FeedCard(s)
            ├── Title
            ├── Description
            ├── Badge (Service/Request)
            └── Price (for requests only)
```

## Components

### HomeScreen
- Uses fixed preset to avoid nested scrolling issues
- Handles safe area insets for top edge
- Manages event press callbacks
- Black background with white text

### Feed Component
- Container for FlatList of events
- Handles virtualized rendering of feed items
- Manages dummy data (to be replaced with real Nostr events)
- Full width and height with proper padding

### FeedCard Component
- Displays individual NIP89/NIP90 events
- Reversed preset (dark background)
- Shows badge indicating event type (Service/Request)
- Displays price for NIP90 requests
- Touchable with press feedback

## Event Types

### NIP89 Service Announcements (kind: 31989)
```typescript
{
  kind: 31989,
  pubkey: string,
  content: string,
  tags: [
    ["d", "<supported-event-kind>"],
    ["a", "<app-identifier>", "<relay>", "<platform>"]
  ],
  // Additional metadata
  title: string,
  description: string
}
```

### NIP90 Job Requests (kind: 5000-5999)
```typescript
{
  kind: number, // 5000-5999
  pubkey: string,
  content: string,
  tags: [
    ["i", "<data>", "<input-type>", "<relay>", "<marker>"],
    ["bid", "<msat-amount>"]
  ],
  // Additional metadata
  title: string,
  description: string,
  price: number
}
```

## Styling

### Colors
- Background: Black
- Cards: Dark gray (#333)
- Text: White
- Badges: Dark gray with white text

### Layout
- Cards have consistent margins and padding
- Proper spacing between cards
- Header centered with adequate vertical margin
- Full-width cards with rounded corners

## Future Enhancements
1. Real Nostr event integration
2. Pull-to-refresh functionality
3. Event filtering (by type, price range, etc.)
4. Event detail view
5. Action buttons for different event types
6. User profile integration
7. Real-time updates via WebSocket
8. Infinite scroll with pagination

## Performance Considerations
- Uses FlatList for efficient list rendering
- Proper key extraction for list items
- Disabled vertical scroll indicator for cleaner look
- Avoids nested scrolling issues with fixed Screen preset
- Proper flex layout to ensure full content visibility

## User Interactions
- Cards are touchable with visual feedback
- Future: Pull to refresh
- Future: Infinite scroll
- Future: Filter/sort options
- Future: Direct actions on cards

## Data Flow
1. Currently using dummy data
2. Future implementation will:
   - Subscribe to relevant Nostr relays
   - Filter for kinds 31989 and 5000-5999
   - Parse and format events
   - Update feed in real-time
   - Cache events for offline access