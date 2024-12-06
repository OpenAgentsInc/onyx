import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import DeviceInfo from 'react-native-device-info';
import { 
  OfflineConfig, 
  OfflineOperation, 
  OfflineState,
  ConflictResolution 
} from './types';
import { MCPError } from '../client/errors';

const DEFAULT_CONFIG: Required<OfflineConfig> = {
  maxQueueSize: 1000,
  conflictStrategy: 'last-write-wins',
  syncOnReconnect: true,
  retainPeriod: 7 * 24 * 60 * 60 * 1000 // 7 days
};

export class OfflineManager {
  private config: Required<OfflineConfig>;
  private operations: Map<string, OfflineOperation>;
  private state: OfflineState;
  private deviceId: string;
  private isInitialized: boolean = false;
  private networkListeners: Set<(isOffline: boolean) => void>;

  constructor(config: OfflineConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.operations = new Map();
    this.state = {
      isOffline: false,
      lastOnline: Date.now(),
      pendingOperations: 0,
      lastSync: 0,
      storageUsage: 0
    };
    this.deviceId = '';
    this.networkListeners = new Set();
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Get device ID
      this.deviceId = await DeviceInfo.getUniqueId();

      // Load persisted operations
      await this.loadOperations();

      // Set up network monitoring
      await this.setupNetworkMonitoring();

      // Clean up old operations
      await this.cleanupOldOperations();

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize offline manager:', error);
      throw new MCPError('Failed to initialize offline manager');
    }
  }

  private async loadOperations(): Promise<void> {
    try {
      const data = await AsyncStorage.getItem('mcp:offline:operations');
      if (data) {
        const operations = JSON.parse(data) as OfflineOperation[];
        operations.forEach(op => this.operations.set(op.id, op));
        this.updateState();
      }
    } catch (error) {
      console.error('Failed to load offline operations:', error);
    }
  }

  private async saveOperations(): Promise<void> {
    try {
      const operations = Array.from(this.operations.values());
      await AsyncStorage.setItem('mcp:offline:operations', JSON.stringify(operations));
      this.updateState();
    } catch (error) {
      console.error('Failed to save offline operations:', error);
    }
  }

  private async setupNetworkMonitoring(): Promise<void> {
    // Get initial state
    const netInfo = await NetInfo.fetch();
    this.state.isOffline = !netInfo.isConnected;

    // Subscribe to network changes
    NetInfo.addEventListener(state => {
      const wasOffline = this.state.isOffline;
      this.state.isOffline = !state.isConnected;

      if (wasOffline && !this.state.isOffline) {
        this.handleReconnection();
      }

      // Notify listeners
      this.networkListeners.forEach(listener => {
        try {
          listener(this.state.isOffline);
        } catch (error) {
          console.error('Error in network state listener:', error);
        }
      });
    });
  }

  private async handleReconnection(): Promise<void> {
    if (this.config.syncOnReconnect && this.operations.size > 0) {
      // Trigger sync process
      // This will be implemented in the sync module
      this.state.lastOnline = Date.now();
    }
  }

  async queueOperation(operation: Omit<OfflineOperation, 'id' | 'timestamp' | 'deviceId' | 'conflictResolved'>): Promise<string> {
    await this.initialize();

    if (this.operations.size >= this.config.maxQueueSize) {
      throw new MCPError('Offline operation queue is full');
    }

    const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const timestamp = Date.now();

    const fullOperation: OfflineOperation = {
      ...operation,
      id,
      timestamp,
      deviceId: this.deviceId,
      conflictResolved: false
    };

    this.operations.set(id, fullOperation);
    await this.saveOperations();

    return id;
  }

  async resolveConflict(resolution: ConflictResolution): Promise<void> {
    const operation = this.operations.get(resolution.operationId);
    if (!operation) {
      throw new MCPError('Operation not found');
    }

    switch (resolution.resolution) {
      case 'client':
        // Keep client version
        operation.conflictResolved = true;
        break;
      case 'server':
        // Discard operation
        this.operations.delete(operation.id);
        break;
      case 'merge':
        if (!resolution.mergedData) {
          throw new MCPError('Merged data required for merge resolution');
        }
        // Update with merged data
        operation.data = resolution.mergedData;
        operation.conflictResolved = true;
        break;
    }

    await this.saveOperations();
  }

  private async cleanupOldOperations(): Promise<void> {
    const now = Date.now();
    let removed = 0;

    for (const [id, operation] of this.operations.entries()) {
      if (now - operation.timestamp > this.config.retainPeriod) {
        this.operations.delete(id);
        removed++;
      }
    }

    if (removed > 0) {
      await this.saveOperations();
    }
  }

  private updateState(): void {
    this.state.pendingOperations = this.operations.size;
    this.state.storageUsage = new TextEncoder().encode(
      JSON.stringify(Array.from(this.operations.values()))
    ).length;
  }

  getState(): OfflineState {
    return { ...this.state };
  }

  onNetworkStateChange(listener: (isOffline: boolean) => void): () => void {
    this.networkListeners.add(listener);
    return () => {
      this.networkListeners.delete(listener);
    };
  }

  async getOperation(id: string): Promise<OfflineOperation | null> {
    return this.operations.get(id) || null;
  }

  async getOperations(): Promise<OfflineOperation[]> {
    return Array.from(this.operations.values());
  }

  async clearOperations(): Promise<void> {
    this.operations.clear();
    await this.saveOperations();
  }
}