# ArcLib Integration

## Overview

ArcLib is a TypeScript utility library for interacting with ArcSpec trading chat channels and marketplace listings in the Nostr ecosystem. It provides essential functionality for the Onyx mobile app's trading and marketplace features.

## Core Components

### 1. ArcadeIdentity
- Manages user identity information
- Integrates with Onyx's Nostr identity system
- Uses the same BIP39 seed phrase from Breez SDK

### 2. NIP28Channel
- Handles Nostr chat group functionality
- Implements [NIP-28](https://github.com/nostr-protocol/nips/blob/master/28.md) for public chat
- Integrates with Onyx's Nostr service layer

### 3. NostrPool
- Manages relay connections
- Handles message routing
- Integrates with Onyx's relay management system

### 4. ArcadeListing
- Manages marketplace listings
- Handles "maker" listings in group chat channels
- Maintains current listing set
- Integrates with Onyx's UI components

### 5. ArcadeOffer
- Manages trading offers
- Handles "taker" offers in private chats
- Tracks incoming and outgoing offers
- Integrates with Onyx's notification system

## Key Dependencies

```json
{
  "@noble/curves": "^1.0.0",
  "@scure/base": "^1.1.1",
  "nostr-tools": "^1.13.0",
  "lru-cache": "^10.0.0"
}
```

## Integration Points

### 1. Identity Management
- Uses same BIP39 seed phrase as Breez SDK
- Shares key derivation path with Onyx's Nostr implementation
- Maintains consistent identity across Bitcoin and Nostr

### 2. Relay Communication
- Integrates with Onyx's Nexus relay connection
- Uses shared WebSocket management
- Implements NIP-42 authentication

### 3. Storage
- Optional SQLite storage via any-sqlite
- LRU caching for performance
- Secure key storage via Expo Crypto

### 4. Cryptography
- Uses expo-crypto for mobile
- Implements Nostr event signing
- Handles bech32 encoding/decoding

## Security Considerations

1. Key Management
- Private keys never exposed
- Secure storage implementation
- Memory clearing after use
- Key rotation support

2. Authentication
- NIP-42 compliance
- Challenge verification
- Timeout handling
- Replay attack prevention

3. Data Validation
- Event signature verification
- Timestamp validation
- Relay authentication
- Input sanitization

## Performance

- Bundle size limits:
  - CJS: 10KB
  - ESM: 10KB
- LRU caching for frequently accessed data
- Optimized WebSocket connections
- Efficient event filtering

## Testing

- Jest test environment
- High coverage requirements:
  - Functions: 84%
  - Lines: 84%
  - Statements: 84%
  - Branches: 45%

## Development

- TypeScript for type safety
- ESLint + Prettier for code quality
- Husky for git hooks
- Rollup for bundling
- Development mode optimizations