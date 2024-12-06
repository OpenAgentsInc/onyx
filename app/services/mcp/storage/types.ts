import { Resource } from '../client/types';

export interface StorageConfig {
  namespace?: string;
  version?: string;
  maxSize?: number; // in bytes
}

export interface StorageStats {
  size: number; // in bytes
  itemCount: number;
  lastSync: number;
}

export interface StorageEntry<T> {
  data: T;
  timestamp: number;
  size: number;
}

export interface ResourceStorageEntry extends StorageEntry<Resource> {
  uri: string;
}

export interface ListStorageEntry extends StorageEntry<Resource[]> {
  key: string;
}

export interface StorageMetadata {
  version: string;
  lastCleanup: number;
  totalSize: number;
  itemCount: number;
}