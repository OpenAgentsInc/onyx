import NetInfo from '@react-native-community/netinfo';
import { compress, decompress } from 'lz-string';
import {
  NetworkConfig,
  RequestMetrics,
  NetworkStats,
  BatchOperation,
  NetworkState
} from './types';
import { MCPError } from '../client/errors';

const DEFAULT_CONFIG: Required<NetworkConfig> = {
  maxConcurrentRequests: 4,
  requestTimeout: 30000,
  retryDelay: 1000,
  maxRetries: 3,
  compressionThreshold: 1024, // 1KB
  batchingEnabled: true,
  batchSize: 10,
  batchDelay: 100,
  priorityLevels: 3
};

export class NetworkOptimizer {
  private config: Required<NetworkConfig>;
  private activeRequests: number = 0;
  private metrics: RequestMetrics[] = [];
  private batchQueue: Map<number, BatchOperation[]>;
  private batchTimeouts: Map<number, NodeJS.Timeout>;
  private networkState: NetworkState = {
    type: 'none',
    isMetered: false,
    strength: 1
  };
  private isInitialized: boolean = false;

  constructor(config: NetworkConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.batchQueue = new Map();
    this.batchTimeouts = new Map();
    
    // Initialize queues for each priority level
    for (let i = 0; i < this.config.priorityLevels; i++) {
      this.batchQueue.set(i, []);
    }
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Set up network monitoring
      await this.setupNetworkMonitoring();

      // Start batch processing
      if (this.config.batchingEnabled) {
        this.startBatchProcessing();
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize network optimizer:', error);
      throw new MCPError('Failed to initialize network optimizer');
    }
  }

  private async setupNetworkMonitoring(): Promise<void> {
    const netInfo = await NetInfo.fetch();
    this.updateNetworkState(netInfo);

    NetInfo.addEventListener(state => {
      this.updateNetworkState(state);
    });
  }

  private updateNetworkState(state: any): void {
    this.networkState = {
      type: state.type,
      isMetered: state.isMetered ?? false,
      strength: state.strength ?? 1,
      roundTripTime: state.details?.roundTripTime
    };

    // Adjust configuration based on network state
    this.adjustConfig();
  }

  private adjustConfig(): void {
    const baseConfig = { ...DEFAULT_CONFIG };

    switch (this.networkState.type) {
      case 'wifi':
        // Optimize for WiFi
        this.config = {
          ...baseConfig,
          maxConcurrentRequests: 6,
          compressionThreshold: 2048, // 2KB
          batchDelay: 50
        };
        break;
      case 'cellular':
        // Optimize for cellular
        this.config = {
          ...baseConfig,
          maxConcurrentRequests: 2,
          compressionThreshold: 512, // 0.5KB
          batchSize: 20,
          batchDelay: 200
        };
        break;
      case 'none':
        // Minimal configuration for offline
        this.config = {
          ...baseConfig,
          maxConcurrentRequests: 1,
          compressionThreshold: 256, // 0.25KB
          batchSize: 50,
          batchDelay: 1000
        };
        break;
    }

    // Adjust for metered connections
    if (this.networkState.isMetered) {
      this.config.compressionThreshold = Math.floor(this.config.compressionThreshold / 2);
      this.config.batchSize = Math.floor(this.config.batchSize * 1.5);
    }
  }

  async processRequest<T>(
    request: () => Promise<T>,
    priority: number = 0,
    compress: boolean = true
  ): Promise<T> {
    await this.initialize();

    // Wait for available slot
    while (this.activeRequests >= this.config.maxConcurrentRequests) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.activeRequests++;
    const startTime = Date.now();
    let retries = 0;
    let bytesSent = 0;
    let bytesReceived = 0;

    try {
      while (retries <= this.config.maxRetries) {
        try {
          const result = await Promise.race([
            request(),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Request timeout')), this.config.requestTimeout)
            )
          ]);

          // Calculate metrics
          const endTime = Date.now();
          this.recordMetrics({
            timestamp: startTime,
            duration: endTime - startTime,
            bytesSent,
            bytesReceived,
            compressed: compress,
            retries,
            success: true
          });

          return result as T;
        } catch (error) {
          retries++;
          if (retries > this.config.maxRetries) throw error;
          await new Promise(resolve => 
            setTimeout(resolve, this.config.retryDelay * Math.pow(2, retries - 1))
          );
        }
      }

      throw new Error('Max retries exceeded');
    } catch (error) {
      this.recordMetrics({
        timestamp: startTime,
        duration: Date.now() - startTime,
        bytesSent,
        bytesReceived,
        compressed: compress,
        retries,
        success: false
      });
      throw error;
    } finally {
      this.activeRequests--;
    }
  }

  async batchOperation(operation: Omit<BatchOperation, 'id' | 'timestamp'>): Promise<string> {
    const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const batchOp: BatchOperation = {
      ...operation,
      id,
      timestamp: Date.now()
    };

    const queue = this.batchQueue.get(operation.priority) || [];
    queue.push(batchOp);
    this.batchQueue.set(operation.priority, queue);

    // Reset batch timeout for this priority level
    if (this.batchTimeouts.has(operation.priority)) {
      clearTimeout(this.batchTimeouts.get(operation.priority));
    }

    this.batchTimeouts.set(
      operation.priority,
      setTimeout(() => this.processBatch(operation.priority), this.config.batchDelay)
    );

    return id;
  }

  private async processBatch(priority: number): Promise<void> {
    const queue = this.batchQueue.get(priority) || [];
    if (queue.length === 0) return;

    // Process in chunks
    for (let i = 0; i < queue.length; i += this.config.batchSize) {
      const batch = queue.slice(i, i + this.config.batchSize);
      try {
        // TODO: Implement actual batch processing
        // For now, just clear the processed items
        const processedIds = new Set(batch.map(op => op.id));
        this.batchQueue.set(
          priority,
          queue.filter(op => !processedIds.has(op.id))
        );
      } catch (error) {
        console.error('Failed to process batch:', error);
      }
    }
  }

  private startBatchProcessing(): void {
    // Process batches periodically for each priority level
    for (let priority = 0; priority < this.config.priorityLevels; priority++) {
      setInterval(
        () => this.processBatch(priority),
        this.config.batchDelay * (priority + 1)
      );
    }
  }

  private recordMetrics(metrics: RequestMetrics): void {
    this.metrics.push(metrics);
    // Keep only last 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
  }

  getStats(): NetworkStats {
    const total = this.metrics.length;
    if (total === 0) {
      return {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        totalBytesSent: 0,
        totalBytesReceived: 0,
        averageLatency: 0,
        compressionRatio: 0,
        batchEfficiency: 0
      };
    }

    const successful = this.metrics.filter(m => m.success).length;
    const totalBytesSent = this.metrics.reduce((sum, m) => sum + m.bytesSent, 0);
    const totalBytesReceived = this.metrics.reduce((sum, m) => sum + m.bytesReceived, 0);
    const totalDuration = this.metrics.reduce((sum, m) => sum + m.duration, 0);

    const compressedRequests = this.metrics.filter(m => m.compressed);
    const compressionRatio = compressedRequests.length > 0
      ? compressedRequests.reduce((sum, m) => sum + (m.bytesReceived / m.bytesSent), 0) / compressedRequests.length
      : 0;

    return {
      totalRequests: total,
      successfulRequests: successful,
      failedRequests: total - successful,
      totalBytesSent,
      totalBytesReceived,
      averageLatency: totalDuration / total,
      compressionRatio,
      batchEfficiency: this.calculateBatchEfficiency()
    };
  }

  private calculateBatchEfficiency(): number {
    const totalOperations = Array.from(this.batchQueue.values())
      .reduce((sum, queue) => sum + queue.length, 0);
    
    if (totalOperations === 0) return 1;

    const potentialBatches = Math.ceil(totalOperations / this.config.batchSize);
    const actualBatches = Array.from(this.batchQueue.values())
      .reduce((sum, queue) => sum + Math.ceil(queue.length / this.config.batchSize), 0);

    return potentialBatches / actualBatches;
  }

  getNetworkState(): NetworkState {
    return { ...this.networkState };
  }

  async compressData(data: any): Promise<string> {
    const jsonString = JSON.stringify(data);
    if (jsonString.length < this.config.compressionThreshold) {
      return jsonString;
    }
    return compress(jsonString);
  }

  async decompressData<T>(data: string): Promise<T> {
    try {
      // Try parsing as JSON first
      return JSON.parse(data);
    } catch {
      // If that fails, try decompressing
      const decompressed = decompress(data);
      return JSON.parse(decompressed);
    }
  }
}