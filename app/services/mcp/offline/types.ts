export interface OfflineConfig {
  maxQueueSize?: number;
  conflictStrategy?: 'client-wins' | 'server-wins' | 'last-write-wins' | 'manual';
  syncOnReconnect?: boolean;
  retainPeriod?: number; // How long to keep offline data in milliseconds
}

export interface OfflineOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  resource: string;
  data?: any;
  timestamp: number;
  deviceId: string;
  conflictResolved?: boolean;
}

export interface OfflineState {
  isOffline: boolean;
  lastOnline: number;
  pendingOperations: number;
  lastSync: number;
  storageUsage: number;
}

export interface ConflictResolution {
  operationId: string;
  resolution: 'client' | 'server' | 'merge';
  mergedData?: any;
}