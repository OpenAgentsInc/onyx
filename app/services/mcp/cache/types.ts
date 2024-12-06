import { Resource } from '../client/types';

export interface CacheConfig {
  ttl?: number;
  maxSize?: number;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export interface ResourceCacheEntry extends CacheEntry<Resource> {
  uri: string;
}

export interface ListResourcesCacheEntry extends CacheEntry<Resource[]> {
  key: string; // Changed from literal type to string
}