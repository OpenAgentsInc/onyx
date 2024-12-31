# Aiur - OpenAgents.com Central Service

## Overview

Aiur is our central coordination service hosted at openagents.com. While the Onyx app is designed to function independently in local mode or by connecting to decentralized nodes, certain premium features require central coordination through Aiur.

## Architecture Philosophy

### Decentralized First
- The app functions fully in local mode
- Uses decentralized services (Nostr, Lightning) by default
- No central dependency for core features

### Central Coordination for Premium Features
- Pro subscription management
- Features requiring user-to-user coordination
- Services that need global state or orchestration

## Authentication

All requests to Aiur require a Nostr public key (npub) for authentication. This maintains consistency with our decentralized architecture while enabling user identification.

```typescript
headers: {
  "X-Nostr-Pubkey": npub
}
```

## Premium Features

### Chat Sharing
- Share conversations with specific users
- Generate public share links
- Manage access permissions
- Track and revoke shares

### Training Data Management
- Opt-in to contribute chat data for training
- Granular message selection
- Bitcoin rewards for valuable contributions

### Future Premium Services
- Team collaboration features
- Advanced AI model access
- Custom model training
- Enterprise integrations

## Integration

The app uses the AiurApi service to communicate with openagents.com:

```typescript
import { aiurApi } from "@/services/aiur"

// Initialize with user's npub
aiurApi.setNpub(walletStore.nostrKeys.npub)

// Use premium features
const status = await aiurApi.getProStatus()
```

## Error Handling

Aiur uses standard HTTP status codes and provides detailed error messages:
- 401: Invalid or missing npub
- 402: Premium feature requires subscription
- 403: Insufficient permissions
- 404: Resource not found
- 429: Rate limit exceeded

## Offline Behavior

When Aiur is unavailable:
- App continues functioning in local mode
- Premium features gracefully degrade
- UI indicates premium feature status
- Queues operations for retry when possible

## Development

- Local development uses a mock Aiur service
- Test environment available at test.openagents.com
- Production environment at api.openagents.com

## Configuration

```typescript
// config/config.base.ts
export const AIUR_API_URL = __DEV__ 
  ? "http://localhost:8000"
  : "https://api.openagents.com"
```

## Security Considerations

- All communication over HTTPS
- Npub verification for all requests
- Rate limiting per user
- Audit logging of premium feature usage
- No sensitive data stored centrally
- Share URLs use unguessable UUIDs