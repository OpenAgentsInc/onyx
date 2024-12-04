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
Located in `src/pool.ts`, provides relay connection management:

```typescript
export class NostrPool {
  private pool: ReconnPool;
  private lruSub: LRUCache<string, SubInfo>;
  private filters: Map<string, SubInfo>;
  
  constructor(ident: ArcadeIdentity, db?: ArcadeDb, subopts: SubscriptionOptions = {}) {
    this.pool = new ReconnPool();
    this.lruSub = new LRUCache({ 
      max: 3, 
      dispose: (dat: SubInfo) => { dat.sub.unsub() } 
    });
    this.filters = new Map<string, SubInfo>();
  }
}
```

Key features:
- Automatic reconnection handling
- Subscription management with LRU caching
- Filter-based event routing
- Health monitoring
- Load balancing

### 4. EncChannel
Located in `src/encchannel.ts`, provides encrypted group chat functionality:

```typescript
export class EncChannel {
  public pool: NostrPool;
  private _knownChannels: EncChannelInfo[] = [];

  constructor(pool: NostrPool) {
    this.pool = pool;
  }
}
```

Key features:
1. **Channel Management**
   - Create private channels with member lists
   - Invite new members
   - Update channel metadata
   - List available channels

2. **Message Security**
   - Per-message temporary identities
   - NIP-04 encryption
   - Forward secrecy
   - Access control via channel keys

3. **Event Types**
   - 99: Channel discovery
   - 400: Channel creation/invitation
   - 402: Encrypted messages
   - 403: Metadata updates

Usage example:
```typescript
// Create channel
const channel = await encChannel.createPrivate(
  { name: "OTC Trading", about: "Private OTC trades" },
  [trader1_pubkey, trader2_pubkey]
);

// Send message
await encChannel.send(
  channel.id,
  "Offer: 1 BTC @ $40,000",
  undefined,
  [["t", "trade"]]
);

// Subscribe to messages
encChannel.sub(
  channel,
  (event) => {
    console.log("New trade message:", event.content);
  }
);
```

### 5. ArcadeListing
- Manages marketplace listings
- Handles "maker" listings in group chat channels
- Maintains current listing set
- Integrates with Onyx's UI components

### 6. ArcadeOffer
- Manages trading offers
- Handles "taker" offers in private chats
- Tracks incoming and outgoing offers
- Integrates with Onyx's notification system

## Storage Architecture

### SQLite Integration
Located in `src/db/base.ts`, implements persistent storage:

```typescript
export class ArcadeDb implements ArcadeDbInterface {
  queue: Map<string, NostrEvent>;
  timer: NodeJS.Timeout | null;
  db: Database;

  async open() {
    if (!this.db) {
      this.db = await open("arcade.1");
      await this.db.execute(`
        CREATE TABLE IF NOT EXISTS posts (
          id STRING NOT NULL PRIMARY KEY,
          content STRING,
          kind INTEGER,
          pubkey STRING,
          sig STRING,
          tags STRING,
          p1 STRING,
          e1 STRING,
          created_at INTEGER,
          verified BOOLEAN
        );
      `);
    }
  }
}
```

Features:
- Event queueing with batched writes
- Efficient filtering and querying
- Tag indexing (p1, e1)
- Automatic schema creation
- Transaction support

### Event Caching
The NostrPool implements a tiered caching system:

1. In-Memory Queue
```typescript
queue: Map<string, NostrEvent>
```
- Buffers recent events
- Batch writes every 500ms
- Prevents duplicate processing

2. LRU Subscription Cache
```typescript
lruSub: LRUCache<string, SubInfo>
```
- Caches active subscriptions
- Maximum 3 concurrent subscriptions
- Automatic cleanup of unused subscriptions

## Relay Management

### Connection Pool
The ReconnPool class extends nostr-tools' SimplePool:

```typescript
export class ReconnPool extends SimplePool {
  keepClosed: Set<string>;
  reconnectTimeout: number;
  
  async ensureRelay(url: string): Promise<Relay> {
    this.keepClosed.delete(url);
    const relay = await super.ensureRelay(url);
    relay.on('disconnect', () => {
      if (!this.keepClosed.has(url)) {
        this.reconnect(url);
      }
    });
    return relay;
  }
}
```

Features:

1. Connection Management
- Automatic reconnection with 5s timeout
- Connection state tracking
- Graceful shutdown support
- Connection pooling

2. Event Routing
```typescript
async sub(
  filters: Filter<number>[],
  callback: (event: NostrEvent) => void,
  eose?: () => Promise<void>,
  since?: number,
  closeOnEose?: boolean
): void {
  // Handle new and existing subscriptions
  // Route events to appropriate callbacks
  // Manage subscription lifecycle
}
```

3. Health Monitoring
- Tracks disconnections
- Implements backoff strategy
- Maintains relay availability status

4. Message Handling
```typescript
async send(message: UnsignedEvent): Promise<NostrEvent> {
  const [event, pubs] = await this.publish(message);
  return new Promise<NostrEvent>((res, rej) => {
    setTimeout(() => rej("send timed out"), 3000);
    pubs.on('ok', () => res(event));
  });
}
```

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
- Efficient event batching
- Connection pooling
- LRU caching
- Optimized SQLite queries

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