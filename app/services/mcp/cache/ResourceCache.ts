import { Resource } from '../client/types';
import { CacheConfig, ResourceCacheEntry, ListResourcesCacheEntry } from './types';

export class ResourceCache {
  private cache: Map<string, ResourceCacheEntry>;
  private listCache: Map<string, ListResourcesCacheEntry>;
  private config: Required<CacheConfig>;

  constructor(config: CacheConfig = {}) {
    this.config = {
      ttl: config.ttl ?? 5 * 60 * 1000, // 5 minutes default TTL
      maxSize: config.maxSize ?? 1000
    };
    this.cache = new Map();
    this.listCache = new Map();
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

    // Invalidate list caches that might contain this resource
    this.listCache.clear();
  }

  async delete(uri: string): Promise<void> {
    this.cache.delete(uri);
    // Invalidate list caches as they might contain this resource
    this.listCache.clear();
  }

  async getList(cacheKey: string): Promise<Resource[] | null> {
    const entry = this.listCache.get(cacheKey);
    if (!entry || this.isStale(entry)) {
      this.listCache.delete(cacheKey);
      return null;
    }

    return entry.data;
  }

  async setList(cacheKey: string, resources: Resource[]): Promise<void> {
    // Maintain a maximum number of list caches
    if (this.listCache.size >= 10) { // Arbitrary limit for list caches
      const oldestKey = Array.from(this.listCache.entries())
        .reduce((oldest, [key, entry]) => {
          if (!oldest || entry.timestamp < this.listCache.get(oldest)!.timestamp) {
            return key;
          }
          return oldest;
        }, null as string | null);

      if (oldestKey) {
        this.listCache.delete(oldestKey);
      }
    }

    this.listCache.set(cacheKey, {
      key: cacheKey,
      data: resources,
      timestamp: Date.now()
    });

    // Cache individual resources as well
    for (const resource of resources) {
      await this.set(resource.uri, resource);
    }
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
    this.listCache.clear();
  }

  getSize(): { resources: number; lists: number } {
    return {
      resources: this.cache.size,
      lists: this.listCache.size
    };
  }

  getCacheStats(): {
    resourceCount: number;
    listCount: number;
    oldestResource: number;
    newestResource: number;
    memoryUsage: number;
  } {
    let oldestTime = Date.now();
    let newestTime = 0;
    let memoryUsage = 0;

    for (const entry of this.cache.values()) {
      if (entry.timestamp < oldestTime) oldestTime = entry.timestamp;
      if (entry.timestamp > newestTime) newestTime = entry.timestamp;
      memoryUsage += JSON.stringify(entry).length * 2; // Rough estimate
    }

    for (const entry of this.listCache.values()) {
      memoryUsage += JSON.stringify(entry).length * 2;
    }

    return {
      resourceCount: this.cache.size,
      listCount: this.listCache.size,
      oldestResource: oldestTime,
      newestResource: newestTime,
      memoryUsage // in bytes
    };
  }
}