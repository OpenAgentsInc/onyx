import { Client } from '@modelcontextprotocol/typescript-sdk';
import { WebSocketTransport } from '../transport/WebSocketTransport';
import { ConnectionManager } from '../transport/ConnectionManager';
import { ResourceCache } from '../cache/ResourceCache';
import { 
  MCPConfig, 
  ListResourcesParams,
  ListResourcesResultSchema, 
  ReadResourceResultSchema,
  ResourceUpdateSchema,
  ResourceUpdate
} from './types';
import { ConnectionError, ResourceError } from './errors';

export class OnyxMCPClient {
  private client: Client;
  private transport: WebSocketTransport | null = null;
  private connectionManager: ConnectionManager;
  private resourceCache: ResourceCache;
  private resourceUpdateHandlers: Set<(update: ResourceUpdate) => void> = new Set();

  constructor(config: MCPConfig) {
    this.client = new Client({
      name: 'onyx-mobile',
      version: config.version
    }, {
      capabilities: {
        'resources/list': true,
        'resources/read': true,
        'resources/search': true,
        'resources/watch': true
      }
    });

    this.connectionManager = new ConnectionManager();
    this.resourceCache = new ResourceCache();

    // Set up resource update handling
    this.client.on('resource_update', (update) => {
      this.handleResourceUpdate(update);
    });
  }

  async connect(serverUrl: string): Promise<void> {
    try {
      this.transport = new WebSocketTransport({
        url: serverUrl,
        options: {
          reconnect: true,
          backoff: 'exponential'
        }
      });

      await this.connectionManager.initialize(this.transport);
      await this.client.connect(this.transport);
      
      // Start watching for resource updates
      await this.startWatchingResources();
    } catch (error) {
      throw new ConnectionError(`Failed to connect to MCP server: ${error.message}`);
    }
  }

  private async startWatchingResources(): Promise<void> {
    try {
      await this.client.request({
        method: 'resources/watch',
        params: { types: ['*'] } // Watch all resource types
      });
    } catch (error) {
      console.warn('Failed to start resource watching:', error);
    }
  }

  private handleResourceUpdate(update: ResourceUpdate): void {
    // Update cache based on the update type
    switch (update.type) {
      case 'created':
      case 'updated':
        this.resourceCache.set(update.resource.uri, update.resource);
        break;
      case 'deleted':
        this.resourceCache.delete(update.resource.uri);
        break;
    }

    // Notify all registered handlers
    this.resourceUpdateHandlers.forEach(handler => {
      try {
        handler(update);
      } catch (error) {
        console.error('Error in resource update handler:', error);
      }
    });
  }

  async listResources(params: ListResourcesParams = {}) {
    const cacheKey = this.getCacheKey('list', params);
    const cached = await this.resourceCache.getList(cacheKey);
    if (cached) return cached;

    try {
      const result = await this.client.request(
        { 
          method: 'resources/list',
          params
        },
        ListResourcesResultSchema
      );

      await this.resourceCache.setList(cacheKey, result);
      return result;
    } catch (error) {
      throw new ResourceError(`Failed to list resources: ${error.message}`);
    }
  }

  async readResource(uri: string) {
    const cached = await this.resourceCache.get(uri);
    if (cached) return cached;

    try {
      const result = await this.client.request({
        method: 'resources/read',
        params: { uri }
      }, ReadResourceResultSchema);

      await this.resourceCache.set(uri, result);
      return result;
    } catch (error) {
      throw new ResourceError(`Failed to read resource: ${error.message}`);
    }
  }

  async searchResources(query: string, params: ListResourcesParams = {}) {
    try {
      return await this.client.request({
        method: 'resources/search',
        params: { 
          query,
          ...params
        }
      }, ListResourcesResultSchema);
    } catch (error) {
      throw new ResourceError(`Failed to search resources: ${error.message}`);
    }
  }

  async *streamResources(params: ListResourcesParams = {}) {
    let currentCursor = params.cursor;
    
    while (true) {
      const result = await this.listResources({
        ...params,
        cursor: currentCursor
      });

      for (const resource of result.resources) {
        yield resource;
      }

      if (!result.nextCursor) {
        break;
      }

      currentCursor = result.nextCursor;
    }
  }

  onResourceUpdate(handler: (update: ResourceUpdate) => void): () => void {
    this.resourceUpdateHandlers.add(handler);
    return () => {
      this.resourceUpdateHandlers.delete(handler);
    };
  }

  async disconnect(): Promise<void> {
    this.resourceUpdateHandlers.clear();
    if (this.transport) {
      await this.transport.disconnect();
      this.transport = null;
    }
  }

  getConnectionStatus() {
    return this.connectionManager.getStatus();
  }

  clearCache(): void {
    this.resourceCache.clear();
  }

  private getCacheKey(operation: string, params: Record<string, any>): string {
    return `${operation}:${JSON.stringify(params)}`;
  }
}