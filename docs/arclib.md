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
- Manages relay connections and message routing
- Implements connection pooling for multiple relays
- Handles automatic reconnection and failover
- Load balances requests across available relays
- Maintains relay health metrics
- Implements backoff strategies for failed connections

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

## Storage Architecture

### SQLite Integration
ArcLib uses SQLite for persistent storage through the any-sqlite adapter:

```typescript
interface StorageAdapter {
  init(): Promise<void>;
  getEvents(filter: Filter): Promise<Event[]>;
  addEvent(event: Event): Promise<void>;
  deleteEvent(id: string): Promise<void>;
}

class SQLiteAdapter implements StorageAdapter {
  private db: Database;
  
  async init() {
    // Creates tables if they don't exist
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        pubkey TEXT,
        created_at INTEGER,
        kind INTEGER,
        tags TEXT,
        content TEXT,
        sig TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_pubkey ON events(pubkey);
      CREATE INDEX IF NOT EXISTS idx_kind ON events(kind);
      CREATE INDEX IF NOT EXISTS idx_created_at ON events(created_at);
    `);
  }

  async getEvents(filter: Filter): Promise<Event[]> {
    // Builds dynamic SQL query from filter
    const { sql, params } = this.buildQuery(filter);
    return this.db.all(sql, params);
  }
}
```

Key features:
- Efficient indexing on pubkey, kind, and timestamp
- Prepared statements for performance
- Transaction support for atomic operations
- Migration system for schema updates
- Connection pooling for concurrent access

### LRU Cache Implementation

ArcLib uses LRU (Least Recently Used) caching to optimize frequently accessed data:

```typescript
import { LRUCache } from 'lru-cache';

interface CacheConfig {
  max: number;        // Maximum items in cache
  ttl: number;        // Time to live in ms
  updateAgeOnGet: boolean;
}

class EventCache {
  private cache: LRUCache<string, Event>;
  
  constructor(config: CacheConfig) {
    this.cache = new LRUCache({
      max: config.max,
      ttl: config.ttl,
      updateAgeOnGet: config.updateAgeOnGet,
      
      // Custom disposal queue
      dispose: (value, key) => {
        this.handleEviction(value, key);
      }
    });
  }

  // Implements tiered caching strategy
  async get(id: string): Promise<Event | null> {
    // Check memory cache first
    const cached = this.cache.get(id);
    if (cached) return cached;

    // Fall back to SQLite
    const event = await this.storage.getEvent(id);
    if (event) {
      this.cache.set(id, event);
    }
    return event;
  }
}
```

Caching strategies:
- Tiered caching (memory -> SQLite)
- Automatic eviction of old entries
- Cache invalidation on updates
- Cache warming for predictable access patterns
- Memory usage monitoring and adjustment

## Relay Management

### Connection Pool Architecture

```typescript
interface RelayConfig {
  url: string;
  weight?: number;  // For load balancing
  readOnly?: boolean;
  writeOnly?: boolean;
}

class RelayPool {
  private relays: Map<string, WebSocket>;
  private health: Map<string, HealthMetrics>;
  
  constructor(configs: RelayConfig[]) {
    this.relays = new Map();
    this.health = new Map();
    
    configs.forEach(config => {
      this.addRelay(config);
    });
  }

  private async addRelay(config: RelayConfig) {
    const ws = new WebSocket(config.url);
    
    ws.onmessage = (event) => this.handleMessage(event);
    ws.onerror = (error) => this.handleError(config.url, error);
    ws.onclose = () => this.handleDisconnect(config.url);
    
    this.relays.set(config.url, ws);
    this.health.set(config.url, this.initHealth());
  }
}
```

Features:

1. Connection Management
- Automatic connection pooling
- Connection lifecycle monitoring
- Graceful degradation on failures
- Automatic reconnection with exponential backoff
- Connection pooling limits

2. Load Balancing
- Round-robin distribution
- Weighted request distribution
- Adaptive load balancing based on latency
- Geographic routing support
- Priority queuing for critical messages

3. Health Monitoring
```typescript
interface HealthMetrics {
  latency: number[];      // Rolling window of recent latencies
  errors: number;         // Error count in current window
  successRate: number;    // Success rate in current window
  lastSeen: number;       // Timestamp of last successful message
  backoffLevel: number;   // Current backoff level
}

class HealthMonitor {
  private static readonly WINDOW_SIZE = 100;
  private static readonly ERROR_THRESHOLD = 0.1;
  
  updateMetrics(relay: string, latency: number, success: boolean) {
    const metrics = this.health.get(relay);
    
    // Update rolling latency window
    metrics.latency.push(latency);
    if (metrics.latency.length > WINDOW_SIZE) {
      metrics.latency.shift();
    }
    
    // Update success rate
    metrics.successRate = this.calculateSuccessRate(metrics);
    
    // Adjust backoff if needed
    if (metrics.successRate < ERROR_THRESHOLD) {
      this.increaseBackoff(relay);
    }
  }
}
```

4. Message Routing
- Smart routing based on message type
- Duplicate message detection
- Message prioritization
- Rate limiting
- Retry logic for failed messages

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