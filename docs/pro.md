# Pro Service Integration

## Overview

The Pro service enables advanced features through integration with the OpenAgents.com Rust API server. Pro features are available to:
- Pro subscribers ($10/month or $60/year)
- Business Pro subscribers ($500+/month)

## Chat Sharing Features

### Direct User Sharing
- Share entire chat history with specific users
- Configurable permissions:
  - Read-only access
  - Read/write access (recipient can participate)
- Access management:
  - Revocable at any time by original owner
  - Tracks active shares per chat

### Public Sharing
- Generate public shareable URLs
- Visibility options:
  - Public (discoverable via OpenAgents.com)
  - Unlisted (accessible only via direct link) [Future]
- Integration with OpenAgents.com discovery widget

### Training Data Contribution
- Separate opt-in from sharing settings
- Granular control:
  - Select specific messages for training
  - Exclude sensitive/private messages
- Bitcoin rewards for valuable training data

## API Integration

### Endpoints

```rust
// Pro status check
GET /api/v1/pro/status
Response: { active: bool, plan: string, features: string[] }

// Share management
POST /api/v1/chats/{chat_id}/share
Body: {
  type: "user" | "public",
  recipient_id?: string,  // For user shares
  permissions: "read" | "write",
  training_data: boolean
}
Response: { 
  share_id: string,
  share_url?: string  // For public shares
}

// List active shares
GET /api/v1/chats/{chat_id}/shares
Response: {
  shares: [{
    id: string,
    type: "user" | "public",
    recipient?: { id: string, username: string },
    permissions: "read" | "write",
    created_at: string,
    training_data: boolean
  }]
}

// Revoke share
DELETE /api/v1/chats/{chat_id}/shares/{share_id}

// Training data management
POST /api/v1/chats/{chat_id}/training
Body: {
  message_ids: string[],
  opt_in: boolean
}
```

### Client Integration

1. Add pro status check to app initialization
2. Implement share modal with:
   - User search/select
   - Permission toggles
   - Training data opt-in
3. Add share management UI to chat settings
4. Integrate with Bitcoin rewards system

## Data Models

```typescript
interface Share {
  id: string;
  chatId: string;
  ownerId: string;
  type: 'user' | 'public';
  recipientId?: string;
  permissions: 'read' | 'write';
  shareUrl?: string;
  trainingData: boolean;
  createdAt: Date;
  revokedAt?: Date;
}

interface TrainingContribution {
  id: string;
  chatId: string;
  messageIds: string[];
  userId: string;
  status: 'pending' | 'approved' | 'rewarded';
  rewardAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## Usage Tracking

While no strict limits are enforced, we track:
- Active shares per user
- Training data contributions
- Reward distributions

## Security Considerations

- All share URLs use unguessable UUIDs
- Rate limiting on share creation/management
- Audit logging for all share operations
- Encrypted storage of shared chat data