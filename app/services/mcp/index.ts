export { OnyxMCPClient } from './client/OnyxMCPClient';
export { WebSocketTransport } from './transport/WebSocketTransport';
export { ConnectionManager } from './transport/ConnectionManager';
export { ResourceCache } from './cache/ResourceCache';
export { MCPStorage } from './storage/AsyncStorage';
export { BackgroundSync } from './sync/BackgroundSync';
export { OfflineManager } from './offline/OfflineManager';
export { NetworkOptimizer } from './network/NetworkOptimizer';
export { useMCPClient } from './hooks/useMCPClient';
export { useMCPResource } from './hooks/useMCPResource';

// Type exports
export type { MCPConfig, Resource } from './client/types';
export type { TransportOptions, TransportMessage } from './transport/types';
export type { CacheConfig } from './cache/types';
export type { StorageConfig, StorageStats } from './storage/types';
export type { SyncConfig, SyncOperation, SyncStats } from './sync/types';
export type { 
  OfflineConfig, 
  OfflineOperation, 
  OfflineState,
  ConflictResolution 
} from './offline/types';
export type {
  NetworkConfig,
  RequestMetrics,
  NetworkStats,
  BatchOperation,
  NetworkState
} from './network/types';

// Error exports
export { 
  MCPError, 
  ConnectionError, 
  ResourceError 
} from './client/errors';