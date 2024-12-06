export interface SyncConfig {
  minInterval?: number; // Minimum time between syncs in milliseconds
  maxRetries?: number; // Maximum number of retry attempts
  batchSize?: number; // Number of items to sync in each batch
  networkTypes?: Array<'wifi' | 'cellular' | 'none'>; // Allowed network types
  batteryLevel?: number; // Minimum battery level required (0-1)
}

export interface SyncOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  uri: string;
  data?: any;
  timestamp: number;
  retryCount: number;
  priority: number;
}

export interface SyncStats {
  pendingOperations: number;
  lastSync: number;
  failedOperations: number;
  successfulOperations: number;
  nextScheduledSync: number;
}