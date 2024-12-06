import { Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import * as Battery from 'expo-battery';
import BackgroundFetch from 'react-native-background-fetch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SyncConfig, SyncOperation, SyncStats } from './types';
import { MCPError } from '../client/errors';

const DEFAULT_CONFIG: Required<SyncConfig> = {
  minInterval: 15 * 60 * 1000, // 15 minutes
  maxRetries: 5,
  batchSize: 50,
  networkTypes: ['wifi', 'cellular'],
  batteryLevel: 0.2 // 20% minimum battery
};

export class BackgroundSync {
  private config: Required<SyncConfig>;
  private syncQueue: Map<string, SyncOperation>;
  private isInitialized: boolean = false;
  private isSyncing: boolean = false;
  private lastSync: number = 0;
  private stats: SyncStats = {
    pendingOperations: 0,
    lastSync: 0,
    failedOperations: 0,
    successfulOperations: 0,
    nextScheduledSync: 0
  };

  constructor(config: SyncConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.syncQueue = new Map();
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Initialize background fetch
      await BackgroundFetch.configure({
        minimumFetchInterval: Math.floor(this.config.minInterval / 1000), // Convert to seconds
        stopOnTerminate: false,
        startOnBoot: true,
        enableHeadless: true
      }, async () => {
        await this.performSync();
        BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
      }, (error) => {
        console.error('Background fetch failed to start:', error);
      });

      // Load persisted queue
      await this.loadQueue();
      
      // Start periodic sync check
      this.startPeriodicCheck();
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize background sync:', error);
      throw new MCPError('Failed to initialize background sync');
    }
  }

  private async loadQueue(): Promise<void> {
    try {
      const queueData = await AsyncStorage.getItem('mcp:sync:queue');
      if (queueData) {
        const operations = JSON.parse(queueData) as SyncOperation[];
        operations.forEach(op => this.syncQueue.set(op.id, op));
      }
    } catch (error) {
      console.error('Failed to load sync queue:', error);
    }
  }

  private async saveQueue(): Promise<void> {
    try {
      const operations = Array.from(this.syncQueue.values());
      await AsyncStorage.setItem('mcp:sync:queue', JSON.stringify(operations));
    } catch (error) {
      console.error('Failed to save sync queue:', error);
    }
  }

  async queueOperation(operation: Omit<SyncOperation, 'id' | 'timestamp' | 'retryCount' | 'priority'>): Promise<void> {
    const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const timestamp = Date.now();
    
    this.syncQueue.set(id, {
      ...operation,
      id,
      timestamp,
      retryCount: 0,
      priority: this.calculatePriority(operation.type)
    });

    await this.saveQueue();
    await this.checkSync();
  }

  private calculatePriority(type: SyncOperation['type']): number {
    switch (type) {
      case 'create':
        return 2;
      case 'update':
        return 1;
      case 'delete':
        return 3;
      default:
        return 0;
    }
  }

  private async checkSync(): Promise<void> {
    if (this.isSyncing || this.syncQueue.size === 0) return;
    
    const now = Date.now();
    if (now - this.lastSync < this.config.minInterval) {
      return;
    }

    const canSync = await this.canPerformSync();
    if (canSync) {
      await this.performSync();
    }
  }

  private async canPerformSync(): Promise<boolean> {
    try {
      // Check network
      const networkState = await NetInfo.fetch();
      if (!this.config.networkTypes.includes(networkState.type as any)) {
        return false;
      }

      // Check battery
      if (Platform.OS !== 'web') {
        const batteryLevel = await Battery.getBatteryLevelAsync();
        if (batteryLevel < this.config.batteryLevel) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error checking sync conditions:', error);
      return false;
    }
  }

  private async performSync(): Promise<void> {
    if (this.isSyncing) return;
    
    this.isSyncing = true;
    this.lastSync = Date.now();

    try {
      // Sort operations by priority and timestamp
      const sortedOperations = Array.from(this.syncQueue.values())
        .sort((a, b) => {
          if (a.priority !== b.priority) {
            return b.priority - a.priority;
          }
          return a.timestamp - b.timestamp;
        });

      // Process in batches
      for (let i = 0; i < sortedOperations.length; i += this.config.batchSize) {
        const batch = sortedOperations.slice(i, i + this.config.batchSize);
        await this.processBatch(batch);

        // Check conditions after each batch
        if (!(await this.canPerformSync())) {
          break;
        }
      }
    } finally {
      this.isSyncing = false;
      await this.saveQueue();
      this.updateStats();
    }
  }

  private async processBatch(operations: SyncOperation[]): Promise<void> {
    for (const operation of operations) {
      try {
        // TODO: Implement actual sync logic here
        // For now, just remove from queue
        this.syncQueue.delete(operation.id);
        this.stats.successfulOperations++;
      } catch (error) {
        operation.retryCount++;
        if (operation.retryCount >= this.config.maxRetries) {
          this.syncQueue.delete(operation.id);
          this.stats.failedOperations++;
        }
      }
    }
  }

  private startPeriodicCheck(): void {
    setInterval(async () => {
      await this.checkSync();
    }, Math.floor(this.config.minInterval / 2));
  }

  private updateStats(): void {
    this.stats = {
      pendingOperations: this.syncQueue.size,
      lastSync: this.lastSync,
      failedOperations: this.stats.failedOperations,
      successfulOperations: this.stats.successfulOperations,
      nextScheduledSync: this.lastSync + this.config.minInterval
    };
  }

  getStats(): SyncStats {
    return { ...this.stats };
  }

  async clearQueue(): Promise<void> {
    this.syncQueue.clear();
    await this.saveQueue();
    this.updateStats();
  }
}