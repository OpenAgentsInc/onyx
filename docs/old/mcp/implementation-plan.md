# MCP Implementation Plan

## Overview

This document outlines the comprehensive implementation plan for Model Context Protocol (MCP) in the Onyx mobile app, covering both client implementation and server integrations.

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Onyx Client   │     │   MCP Client     │     │    MCP Servers  │
│   (React Native)│────▶│   (TypeScript)   │────▶│  - Local Files  │
└─────────────────┘     └──────────────────┘     │  - Git          │
                                                 │  - Database      │
                                                 │  - External APIs │
                                                 └─────────────────┘
```

## Directory Structure

```
app/services/mcp/
├── client/
│   ├── index.ts                 # Main client exports
│   ├── OnyxMCPClient.ts         # Core client implementation
│   ├── types.ts                 # TypeScript type definitions
│   └── errors.ts               # Custom error definitions
├── transport/
│   ├── index.ts                 # Transport exports
│   ├── WebSocketTransport.ts    # WebSocket transport implementation
│   ├── ConnectionManager.ts     # Connection management
│   └── types.ts                # Transport-specific types
├── cache/
│   ├── index.ts                 # Cache exports
│   ├── ResourceCache.ts         # Resource caching implementation
│   └── types.ts                # Cache-specific types
├── hooks/
│   ├── index.ts                 # Hooks exports
│   ├── useMCPClient.ts          # React hook for MCP client
│   └── useMCPResource.ts        # Hook for resource management
├── servers/
│   ├── index.ts                 # Server exports
│   └── local-files/            # Local files server implementation
│       ├── index.ts            # Server entry point
│       ├── types.ts           # Server-specific types
│       └── security.ts        # Security implementations
└── index.ts                     # Main barrel file

app/config/
└── mcp.ts                       # Global MCP configuration
```

## Core Components

### 1. Client Implementation

```typescript
// app/services/mcp/client/OnyxMCPClient.ts
export class OnyxMCPClient {
  private client: Client;
  private transport: WebSocketTransport;
  private connectionManager: ConnectionManager;
  private resourceCache: ResourceCache;

  constructor(config: MCPConfig) {
    this.client = new Client({
      name: "onyx-mobile",
      version: config.version
    }, {
      capabilities: {
        "resources/list": true,
        "resources/read": true,
        "resources/search": true
      }
    });
    this.connectionManager = new ConnectionManager();
    this.resourceCache = new ResourceCache();
  }

  async connect(serverUrl: string) {
    this.transport = new WebSocketTransport({
      url: serverUrl,
      options: {
        reconnect: true,
        backoff: "exponential"
      }
    });
    
    await this.connectionManager.initialize(this.transport);
    await this.client.connect(this.transport);
  }

  // Resource methods
  async listResources() {
    const cached = await this.resourceCache.getList();
    if (cached) return cached;

    const result = await this.client.request(
      { method: "resources/list" },
      ListResourcesResultSchema
    );
    
    await this.resourceCache.setList(result);
    return result;
  }

  async readResource(uri: string) {
    const cached = await this.resourceCache.get(uri);
    if (cached) return cached;

    const result = await this.client.request({
      method: "resources/read",
      params: { uri }
    }, ReadResourceResultSchema);

    await this.resourceCache.set(uri, result);
    return result;
  }
}
```

### 2. Mobile Optimizations

```typescript
// app/services/mcp/transport/ConnectionManager.ts
export class ConnectionManager {
  private reconnectAttempts: number = 0;
  private networkType: "wifi" | "cellular" | "offline" = "wifi";
  
  async handleDisconnect() {
    if (this.networkType === "offline") return;
    
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    this.reconnectAttempts++;
    
    await new Promise(resolve => setTimeout(resolve, delay));
    await this.reconnect();
  }

  async optimizeForNetwork(type: "wifi" | "cellular" | "offline") {
    this.networkType = type;
    // Adjust batch sizes and polling intervals based on network type
  }
}

// app/services/mcp/cache/ResourceCache.ts
export class ResourceCache {
  private cache: Map<string, CachedResource>;
  private ttl: number;
  
  async get(uri: string): Promise<CachedResource | null> {
    const cached = this.cache.get(uri);
    if (!cached) return null;
    
    if (this.isStale(cached)) {
      this.cache.delete(uri);
      return null;
    }
    
    return cached.data;
  }
  
  private isStale(cached: CachedResource): boolean {
    return Date.now() - cached.timestamp > this.ttl;
  }
}
```

### 3. React Integration

```typescript
// app/services/mcp/hooks/useMCPClient.ts
export function useMCPClient(config: MCPConfig) {
  const [client, setClient] = useState<OnyxMCPClient | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initClient = async () => {
      try {
        const mcpClient = new OnyxMCPClient(config);
        await mcpClient.connect(config.serverUrl);
        setClient(mcpClient);
      } catch (err) {
        setError(err as Error);
      }
    };

    initClient();
  }, [config]);

  return { client, error };
}

// app/services/mcp/hooks/useMCPResource.ts
export function useMCPResource(uri: string) {
  const { client } = useMCPClient();
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const data = await client?.readResource(uri);
        setResource(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [uri, client]);

  return { resource, loading, error };
}
```

## Implementation Phases

### Phase 1: Core Client Setup (Week 1)
1. Set up directory structure
2. Implement WebSocketTransport
3. Create basic OnyxMCPClient
4. Implement connection management
5. Add basic error handling

### Phase 2: Resource Management (Week 2)
1. Implement resource listing
2. Add resource reading
3. Create caching layer
4. Add resource hooks
5. Test with example servers

### Phase 3: Mobile Optimization (Week 3)
1. Implement connection management
2. Add sophisticated caching
3. Optimize for battery life
4. Handle offline mode
5. Add background sync

### Phase 4: Server Integration (Week 4)
1. Implement local files server
2. Add security measures
3. Test with real repositories
4. Add search capabilities
5. Implement permission system

### Phase 5: Production Readiness (Week 5)
1. Complete error handling
2. Add comprehensive logging
3. Implement analytics
4. Performance optimization
5. Security audit

## Testing Strategy

### Unit Tests
```typescript
describe("OnyxMCPClient", () => {
  it("should initialize with correct configuration", () => {
    const client = new OnyxMCPClient(config);
    expect(client).toBeDefined();
  });

  it("should connect to server successfully", async () => {
    const client = new OnyxMCPClient(config);
    await expect(client.connect(serverUrl)).resolves.not.toThrow();
  });
});

describe("ResourceCache", () => {
  it("should cache and retrieve resources", async () => {
    const cache = new ResourceCache();
    await cache.set("test-uri", testData);
    const result = await cache.get("test-uri");
    expect(result).toEqual(testData);
  });
});
```

### Integration Tests
```typescript
describe("MCP Integration", () => {
  it("should handle full resource lifecycle", async () => {
    const client = new OnyxMCPClient(config);
    await client.connect(serverUrl);
    
    const resources = await client.listResources();
    expect(resources).toBeDefined();
    
    const resource = await client.readResource(resources[0].uri);
    expect(resource).toBeDefined();
  });
});
```

### Mobile-Specific Tests
1. Background/foreground transitions
2. Network type changes
3. Memory usage monitoring
4. Battery impact testing
5. Offline capability testing

## Security Considerations

1. **Connection Security**
   - Use WSS (WebSocket Secure)
   - Implement proper certificate validation
   - Handle authentication tokens securely

2. **Data Security**
   - Sanitize all incoming data
   - Encrypt cached data
   - Implement proper error boundaries

3. **Permission Management**
   - Implement capability negotiation
   - Handle user consent
   - Manage resource access permissions

## Next Steps

1. Create initial directory structure
2. Implement WebSocketTransport
3. Create basic OnyxMCPClient
4. Add connection management
5. Implement resource caching
6. Create React hooks
7. Begin server implementation

## Resources

- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [React Native WebSocket Guide](https://reactnative.dev/docs/network)
- [MCP Specification](https://modelcontextprotocol.io)
- [Example Servers](https://github.com/modelcontextprotocol/servers)