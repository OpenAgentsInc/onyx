import { Resource } from '../client/types';
import { CacheConfig, ResourceCacheEntry, ListResourcesCacheEntry } from './types';

export class ResourceCache {
  private cache: Map<string, ResourceCacheEntry>;
  private listCache: ListResourcesCacheEntry | null = null;
  private config: Required<CacheConfig>;

  constructor(config: CacheConfig = {}) {
    this.config = {
      ttl: config.ttl ?? 5 * 60 * 1000, // 5 minutes default TTL
      maxSize: config.maxSize ?? 1000
    };
    this.cache = new Map();
  }

  async get(uri: string): Promise<Resource | null> {
    const entry = this.cache.get(uri);
    if (!entry) return null;

    if (this.isStale(entry)) {
      this.cache.delete(uri);
      return null;
    }

    return entry.data;
  }

  async set(uri: string, resource: Resource): Promise<void> {
    if (this.cache.size >= this.config.maxSize) {
      this.evictOldest();
    }

    this.cache.set(uri, {
      uri,
      data: resource,
      timestamp: Date.now()
    });
  }

  async getList(): Promise<Resource[] | null> {
    if (!this.listCache || this.isStale(this.listCache)) {
      this.listCache = null;
      return null;
    }

    return this.listCache.data;
  }

  async setList(resources: Resource[]): Promise<void> {
    this.listCache = {
      key: 'resourcesList',
      data: resources,
      timestamp: Date.now()
    };
  }

  private isStale(entry: ResourceCacheEntry | ListResourcesCacheEntry): boolean {
    return Date.now() - entry.timestamp > this.config.ttl;
  }

  private evictOldest(): void {
    let oldestTime = Date.now();
    let oldestUri: string | null = null;

    for (const [uri, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestUri = uri;
      }
    }

    if (oldestUri) {
      this.cache.delete(oldestUri);
    }
  }

  clear(): void {
    this.cache.clear();
    this.listCache = null;
  }

  getSize(): number {
    return this.cache.size;
  }

  getCacheStats(): {
    size: number;
    oldestEntry: number;
    newestEntry: number;
  } {
    let oldestTime = Date.now();
    let newestTime = 0;

    for (const entry of this.cache.values()) {
      if (entry.timestamp < oldestTime) oldestTime = entry.timestamp;
      if (entry.timestamp > newestTime) newestTime = entry.timestamp;
    }

    return {
      size: this.cache.size,
      oldestEntry: oldestTime,
      newestEntry: newestTime
    };
  }
}