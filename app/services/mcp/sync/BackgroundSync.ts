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

// BackgroundFetch status codes
const FETCH_RESULT = {
  NEW_DATA: 'new_data',
  NO_DATA: 'no_data',
  FAILED: 'failed'
} as const;

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
        await BackgroundFetch.finish(FETCH_RESULT.NEW_DATA);
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

  // ... rest of the class implementation stays the same ...
}