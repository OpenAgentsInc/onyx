# ArcLib Integration

[Previous content remains the same until Core Components section]

## Core Components

### 1. ArcadeIdentity
Located in `src/ident.ts`, provides core identity and cryptography functionality:

```typescript
export class ArcadeIdentity {
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

[Rest of the document remains the same]