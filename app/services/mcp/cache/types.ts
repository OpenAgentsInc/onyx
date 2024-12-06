import { Resource } from '../client/types';

export interface CacheConfig {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of items in cache
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export interface ResourceCacheEntry extends CacheEntry<Resource> {
  uri: string;
}

export interface ListResourcesCacheEntry extends CacheEntry<Resource[]> {
  key: 'resourcesList';
}