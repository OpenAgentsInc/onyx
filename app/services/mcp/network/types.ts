export interface NetworkConfig {
  maxConcurrentRequests?: number;
  requestTimeout?: number;
  retryDelay?: number;
  maxRetries?: number;
  compressionThreshold?: number; // in bytes
  batchingEnabled?: boolean;
  batchSize?: number;
  batchDelay?: number; // in milliseconds
  priorityLevels?: number;
}

export interface RequestMetrics {
  timestamp: number;
  duration: number;
  bytesSent: number;
  bytesReceived: number;
  compressed: boolean;
  retries: number;
  success: boolean;
}

export interface NetworkStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalBytesSent: number;
  totalBytesReceived: number;
  averageLatency: number;
  compressionRatio: number;
  batchEfficiency: number;
}

export interface BatchOperation {
  id: string;
  priority: number;
  operation: string;
  data: any;
  timestamp: number;
}

export interface NetworkState {
  type: 'wifi' | 'cellular' | 'none';
  isMetered: boolean;
  strength: number; // 0-1
  roundTripTime?: number;
}