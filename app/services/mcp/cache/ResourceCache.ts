import { Resource } from '../client/types';
import { CacheConfig, ResourceCacheEntry, ListResourcesCacheEntry } from './types';
import { MCPStorage } from '../storage/AsyncStorage';

export class ResourceCache {
  private cache: Map<string, ResourceCacheEntry>;
  private listCache: Map<string, ListResourcesCacheEntry>;
  private storage: MCPStorage;
  private config: Required<CacheConfig>;

  constructor(config: CacheConfig = {}) {
    this.config = {
      ttl: config.ttl ?? 5 * 60 * 1000, // 5 minutes default TTL
      maxSize: config.maxSize ?? 1000
    };
    this.cache = new Map();
    this.listCache = new Map();
    this.storage = new MCPStorage();
  }

  async initialize(): Promise<void> {
    await this.storage.initialize();
  }

  async get(uri: string): Promise<Resource | null> {
    // Try memory cache first
    const entry = this.cache.get(uri);
    if (entry && !this.isStale(entry)) {
      return entry.data;
    }

    if (entry) {
      this.cache.delete(uri);
    }

    // Try persistent storage
    const storedResource = await this.storage.getResource(uri);
    if (storedResource) {
      // Add to memory cache
      this.cache.set(uri, {
        uri,
        data: storedResource,
        timestamp: Date.now()
      });
      return storedResource;
    }

    return null;
  }

  async set(uri: string, resource: Resource): Promise<void> {
    // Handle memory cache
    if (this.cache.size >= this.config.maxSize) {
      this.evictOldest();
    }

    this.cache.set(uri, {
      uri,
      data: resource,
      timestamp: Date.now()
    });

    // Handle persistent storage
    await this.storage.setResource(uri, resource);

    // Invalidate list caches that might contain this resource
    this.listCache.clear();
  }

  async delete(uri: string): Promise<void> {
    this.cache.delete(uri);
    // Invalidate list caches as they might contain this resource
    this.listCache.clear();
  }

  async getList(cacheKey: string): Promise<Resource[] | null> {
    // Try memory cache first
    const entry = this.listCache.get(cacheKey);
    if (entry && !this.isStale(entry)) {
      return entry.data;
    }

    if (entry) {
      this.listCache.delete(cacheKey);
    }

    // Try persistent storage
    const storedList = await this.storage.getResourceList(cacheKey);
    if (storedList) {
      // Add to memory cache
      this.listCache.set(cacheKey, {
        key: cacheKey,
        data: storedList,
        timestamp: Date.now()
      });
      return storedList;
    }

    return null;
  }

  async setList(cacheKey: string, resources: Resource[]): Promise<void> {
    // Handle memory cache
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

    // Handle persistent storage
    await this.storage.setResourceList(cacheKey, resources);

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

  async clear(): Promise<void> {
    this.cache.clear();
    this.listCache.clear();
    await this.storage.clear();
  }

  getSize(): { resources: number; lists: number } {
    return {
      resources: this.cache.size,
      lists: this.listCache.size
    };
  }

  async getCacheStats(): Promise<{
    memoryCache: {
      resourceCount: number;
      listCount: number;
      oldestResource: number;
      newestResource: number;
    };
    persistentStorage: {
      size: number;
      itemCount: number;
      lastSync: number;
    };
  }> {
    let oldestTime = Date.now();
    let newestTime = 0;

    for (const entry of this.cache.values()) {
      if (entry.timestamp < oldestTime) oldestTime = entry.timestamp;
      if (entry.timestamp > newestTime) newestTime = entry.timestamp;
    }

    const storageStats = await this.storage.getStats();

    return {
      memoryCache: {
        resourceCount: this.cache.size,
        listCount: this.listCache.size,
        oldestResource: oldestTime,
        newestResource: newestTime
      },
      persistentStorage: storageStats
    };
  }
}