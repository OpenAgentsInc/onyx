import { Client } from '@modelcontextprotocol/typescript-sdk';
import { WebSocketTransport } from '../transport/WebSocketTransport';
import { ConnectionManager } from '../transport/ConnectionManager';
import { ResourceCache } from '../cache/ResourceCache';
import { MCPConfig, ListResourcesResultSchema, ReadResourceResultSchema } from './types';
import { ConnectionError, ResourceError } from './errors';

export class OnyxMCPClient {
  private client: Client;
  private transport: WebSocketTransport | null = null;
  private connectionManager: ConnectionManager;
  private resourceCache: ResourceCache;

  constructor(config: MCPConfig) {
    this.client = new Client({
      name: 'onyx-mobile',
      version: config.version
    }, {
      capabilities: {
        'resources/list': true,
        'resources/read': true,
        'resources/search': true
      }
    });

    this.connectionManager = new ConnectionManager();
    this.resourceCache = new ResourceCache();
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
    } catch (error) {
      throw new ConnectionError(`Failed to connect to MCP server: ${error.message}`);
    }
  }

  async listResources() {
    const cached = await this.resourceCache.getList();
    if (cached) return cached;

    try {
      const result = await this.client.request(
        { method: 'resources/list' },
        ListResourcesResultSchema
      );

      await this.resourceCache.setList(result);
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

  async searchResources(query: string) {
    try {
      return await this.client.request({
        method: 'resources/search',
        params: { query }
      });
    } catch (error) {
      throw new ResourceError(`Failed to search resources: ${error.message}`);
    }
  }

  async disconnect(): Promise<void> {
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
}