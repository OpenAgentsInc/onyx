import AsyncStorage from '@react-native-async-storage/async-storage';
import { Resource } from '../client/types';
import {
  StorageConfig,
  StorageStats,
  StorageEntry,
  ResourceStorageEntry,
  ListStorageEntry,
  StorageMetadata
} from './types';

const DEFAULT_CONFIG: Required<StorageConfig> = {
  namespace: 'mcp',
  version: '1',
  maxSize: 50 * 1024 * 1024 // 50MB default max size
};

export class MCPStorage {
  private config: Required<StorageConfig>;
  private metadata: StorageMetadata;
  private initialized: boolean = false;

  constructor(config: StorageConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.metadata = {
      version: this.config.version,
      lastCleanup: 0,
      totalSize: 0,
      itemCount: 0
    };
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      const storedMetadata = await this.getItem<StorageMetadata>('metadata');
      if (storedMetadata) {
        this.metadata = storedMetadata;
        
        // Version migration check
        if (storedMetadata.version !== this.config.version) {
          await this.migrateStorage(storedMetadata.version);
        }
      } else {
        await this.setItem('metadata', this.metadata);
      }

      // Cleanup if needed
      const now = Date.now();
      if (now - this.metadata.lastCleanup > 24 * 60 * 60 * 1000) { // Daily cleanup
        await this.cleanup();
      }

      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize storage:', error);
      throw error;
    }
  }

  private async migrateStorage(oldVersion: string): Promise<void> {
    // Implement version-specific migrations here
    console.log(`Migrating storage from version ${oldVersion} to ${this.config.version}`);
    
    // Update metadata version
    this.metadata.version = this.config.version;
    await this.setItem('metadata', this.metadata);
  }

  private getKey(key: string): string {
    return `${this.config.namespace}:${key}`;
  }

  private async getItem<T>(key: string): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(this.getKey(key));
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Failed to get item ${key}:`, error);
      return null;
    }
  }

  private async setItem(key: string, value: any): Promise<void> {
    try {
      const data = JSON.stringify(value);
      await AsyncStorage.setItem(this.getKey(key), data);
    } catch (error) {
      console.error(`Failed to set item ${key}:`, error);
      throw error;
    }
  }

  async getResource(uri: string): Promise<Resource | null> {
    await this.initialize();
    const entry = await this.getItem<ResourceStorageEntry>(`resource:${uri}`);
    return entry?.data ?? null;
  }

  async setResource(uri: string, resource: Resource): Promise<void> {
    await this.initialize();
    
    const entry: ResourceStorageEntry = {
      uri,
      data: resource,
      timestamp: Date.now(),
      size: JSON.stringify(resource).length
    };

    // Check if we need to make space
    if (this.metadata.totalSize + entry.size > this.config.maxSize) {
      await this.makeSpace(entry.size);
    }

    await this.setItem(`resource:${uri}`, entry);
    
    // Update metadata
    this.metadata.totalSize += entry.size;
    this.metadata.itemCount++;
    await this.setItem('metadata', this.metadata);
  }

  async getResourceList(key: string): Promise<Resource[] | null> {
    await this.initialize();
    const entry = await this.getItem<ListStorageEntry>(`list:${key}`);
    return entry?.data ?? null;
  }

  async setResourceList(key: string, resources: Resource[]): Promise<void> {
    await this.initialize();
    
    const entry: ListStorageEntry = {
      key,
      data: resources,
      timestamp: Date.now(),
      size: JSON.stringify(resources).length
    };

    // Check if we need to make space
    if (this.metadata.totalSize + entry.size > this.config.maxSize) {
      await this.makeSpace(entry.size);
    }

    await this.setItem(`list:${key}`, entry);
    
    // Update metadata
    this.metadata.totalSize += entry.size;
    this.metadata.itemCount++;
    await this.setItem('metadata', this.metadata);
  }

  private async makeSpace(neededSize: number): Promise<void> {
    const keys = await AsyncStorage.getAllKeys();
    const ourKeys = keys.filter(k => k.startsWith(this.config.namespace));
    
    // Sort by timestamp (oldest first)
    const entries: Array<[string, StorageEntry<any>]> = await Promise.all(
      ourKeys.map(async key => [key, await this.getItem(key)])
    );
    
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

    let freedSpace = 0;
    for (const [key, entry] of entries) {
      if (key === this.getKey('metadata')) continue;
      
      await AsyncStorage.removeItem(key);
      freedSpace += entry.size;
      
      // Update metadata
      this.metadata.totalSize -= entry.size;
      this.metadata.itemCount--;
      
      if (freedSpace >= neededSize) break;
    }

    await this.setItem('metadata', this.metadata);
  }

  async cleanup(): Promise<void> {
    await this.initialize();
    
    const keys = await AsyncStorage.getAllKeys();
    const ourKeys = keys.filter(k => k.startsWith(this.config.namespace));
    
    let totalSize = 0;
    let itemCount = 0;

    for (const key of ourKeys) {
      const entry = await this.getItem<StorageEntry<any>>(key);
      if (entry) {
        totalSize += entry.size;
        itemCount++;
      }
    }

    // Update metadata
    this.metadata = {
      version: this.config.version,
      lastCleanup: Date.now(),
      totalSize,
      itemCount
    };
    
    await this.setItem('metadata', this.metadata);
  }

  async clear(): Promise<void> {
    await this.initialize();
    
    const keys = await AsyncStorage.getAllKeys();
    const ourKeys = keys.filter(k => k.startsWith(this.config.namespace));
    
    await Promise.all(ourKeys.map(key => AsyncStorage.removeItem(key)));
    
    this.metadata = {
      version: this.config.version,
      lastCleanup: Date.now(),
      totalSize: 0,
      itemCount: 0
    };
    
    await this.setItem('metadata', this.metadata);
  }

  async getStats(): Promise<StorageStats> {
    await this.initialize();
    return {
      size: this.metadata.totalSize,
      itemCount: this.metadata.itemCount,
      lastSync: this.metadata.lastCleanup
    };
  }
}