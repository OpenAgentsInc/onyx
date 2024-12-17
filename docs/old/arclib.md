# ArcLib Integration

## Overview

ArcLib is a TypeScript utility library for interacting with ArcSpec trading chat channels and marketplace listings in the Nostr ecosystem. It provides essential functionality for the Onyx mobile app's trading and marketplace features.

## Core Components

### 1. NostrIdentity
Located in `src/ident.ts`, provides core identity and cryptography functionality:

```typescript
export class NostrIdentity {
  public privKey: string;
  public pubKey: string;

  constructor(
    public nsec_or_priv: string,
    public bitcoinAddress: string = '',
    public lnUrl: string = ''
  ) {
    // Initialize from nsec or private key
  }
}
```

Key features:
1. **Identity Management**
   - BIP39 seed phrase integration
   - Nostr key derivation
   - Bitcoin/Lightning integration

2. **Encryption Methods**
   - NIP-04 standard encryption
   - Extended NIP-04X with shared secrets
   - Self-encryption for local storage
   - Forward secrecy with temporary keys

3. **Event Signing**
   - Standard Nostr event signing
   - Event verification
   - Signature validation

4. **Performance Optimizations**
```typescript
const ssCache = new LRUCache<string[], Uint8Array>({max:500})
```
- Shared secret caching
- Memory-efficient key handling
- Automatic cache cleanup

### 2. ArcadeListing
Located in `src/listing.ts`, implements marketplace functionality:

```typescript
export class ArcadeListings {
  channel_id: string;
  conn: Nip28Channel;
  private: PrivateMessageManager;

  constructor(conn: Nip28Channel, id: string) {
    this.conn = conn;
    this.private = new PrivateMessageManager(conn.pool);
    this.channel_id = id;
  }
}
```

Key features:
1. **Listing Management**
```typescript
interface ArcadeListing extends ArcadeEvent {
  type: 'l1';
  action: 'buy' | 'sell';
  item: string;
  price: number;
  currency: string;
  amt: number;
  min_amt?: number;
  payments: string[];
  expiration: number;
}
```

2. **Offer Handling**
```typescript
interface ArcadeOffer extends ArcadeEvent {
  type: 'o1';
  price: number;
  currency: string;
  amt: number;
  payment: string;
  expiration: number;
}
```

3. **Trade Actions**
```typescript
interface ArcadeAction extends ArcadeEvent {
  type: 'a1';
  action: 'accept' | 'finalize' | 'comment';
}
```

4. **Privacy Features**
- Geohash precision limiting (5 digits)
- Private messaging support
- Expiration handling
- Public/private listing options

### 3. NIP28Channel
Located in `src/nip28channel.ts`, implements public chat functionality:

```typescript
export class Nip28Channel {
  public pool: NostrPool;
  private _knownChannels: Nip28ChannelInfo[] = [];

  constructor(pool: NostrPool) {
    this.pool = pool;
  }
}
```

Key features:
1. **Channel Types**
```typescript
interface Nip28ChannelInfo {
  name: string;
  about: string;
  picture: string;
  id?: string;
  author?: string;
}
```

2. **Event Kinds**
- 40: Channel creation
- 41: Channel metadata
- 42: Channel message
- 5: Message deletion

3. **Channel Operations**
```typescript
async create(meta: Nip28ChannelInfo): Promise<NostrEvent>
async setMeta(channel_id: string, meta: Nip28ChannelInfo)
async send(channel_id: string, content: string, replyTo?: string)
async delete(event_id: string)
```

4. **Message Threading**
- Root message support
- Reply threading
- Message deletion
- Event filtering

### 4. NostrPool
Located in `src/pool.ts`, provides relay connection management:

```typescript
export class NostrPool {
  private pool: ReconnPool;
  private lruSub: LRUCache<string, SubInfo>;
  private filters: Map<string, SubInfo>;

  constructor(ident: NostrIdentity, db?: NostrDb, subopts: SubscriptionOptions = {}) {
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

### 5. EncChannel
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

## Storage Architecture

### SQLite Integration
Located in `src/db/base.ts`, implements persistent storage:

```typescript
export class NostrDb implements NostrDbInterface {
  queue: Map<string, NostrEvent>;
  timer: NodeJS.Timeout | null;
  db: Database;

  async open() {
    if (!this.db) {
      this.db = await open("onyx.1");
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
