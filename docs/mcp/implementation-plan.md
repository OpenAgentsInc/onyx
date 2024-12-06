# MCP Implementation Plan

## Overview

This document outlines the implementation plan for integrating the Model Context Protocol (MCP) client into the Onyx mobile app. The implementation will be housed in the `app/services/mcp` directory, following the project's established service architecture patterns.

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
│   └── types.ts                 # Transport-specific types
├── hooks/
│   ├── index.ts                 # Hooks exports
│   ├── useMCPClient.ts          # React hook for MCP client
│   └── useMCPResource.ts        # Hook for resource management
├── config/
│   ├── index.ts                 # Configuration exports
│   └── defaults.ts             # Default configuration
└── index.ts                     # Main barrel file

app/config/
└── mcp.ts                       # Global MCP configuration
```

## Implementation Steps

### 1. Core Client Implementation

#### OnyxMCPClient.ts
```typescript
import { Client } from "@modelcontextprotocol/sdk/client";
import { WebSocketTransport } from "../transport";

export class OnyxMCPClient {
  private client: Client;
  
  constructor(config: MCPConfig) {
    this.client = new Client({
      name: "onyx-mobile",
      version: config.version
    }, {
      capabilities: config.capabilities
    });
  }

  async connect(serverUrl: string) {
    const transport = new WebSocketTransport({
      url: serverUrl
    });
    await this.client.connect(transport);
  }

  // Resource methods
  async listResources() {
    // Implementation
  }

  async readResource(uri: string) {
    // Implementation
  }

  // Tool methods
  async listTools() {
    // Implementation
  }

  async executeTool(name: string, params: any) {
    // Implementation
  }
}
```

### 2. Transport Implementation

#### WebSocketTransport.ts
```typescript
import { Transport } from "@modelcontextprotocol/sdk/client";

export class WebSocketTransport implements Transport {
  private ws: WebSocket;
  
  constructor(config: TransportConfig) {
    // Implementation
  }

  async send(message: any): Promise<void> {
    // Implementation
  }

  onMessage(handler: (message: any) => void): void {
    // Implementation
  }

  async close(): Promise<void> {
    // Implementation
  }
}
```

### 3. React Hooks

#### useMCPClient.ts
```typescript
import { useEffect, useState } from 'react';
import { OnyxMCPClient } from '../client';

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
```

## Implementation Phases

### Phase 1: Basic Handshake
1. Set up basic directory structure
2. Implement WebSocketTransport
3. Create OnyxMCPClient with connection capabilities
4. Add basic error handling
5. Create useMCPClient hook
6. Test basic handshake with a test server

### Phase 2: Resource Management
1. Implement resource listing
2. Implement resource reading
3. Add resource caching
4. Create useMCPResource hook
5. Test with real resources

### Phase 3: Tool Integration
1. Implement tool discovery
2. Add tool execution capabilities
3. Create tool-specific hooks
4. Test with example tools

### Phase 4: Production Readiness
1. Add comprehensive error handling
2. Implement retry mechanisms
3. Add logging and monitoring
4. Performance optimization
5. Security review

## Testing Strategy

1. **Unit Tests**
   - Test client initialization
   - Test transport layer
   - Test individual methods
   - Mock server responses

2. **Integration Tests**
   - Test with example MCP servers
   - Test resource access
   - Test tool execution
   - Test error scenarios

3. **Mobile-Specific Tests**
   - Test background/foreground transitions
   - Test network changes
   - Test memory usage
   - Test battery impact

## Security Considerations

1. **Connection Security**
   - Use secure WebSocket connections (WSS)
   - Implement proper certificate validation
   - Handle authentication tokens securely

2. **Data Security**
   - Sanitize all data received from servers
   - Implement proper error boundaries
   - Handle sensitive data appropriately

3. **Permission Management**
   - Implement proper capability negotiation
   - Handle user consent for tool access
   - Manage resource access permissions

## Dependencies

- @modelcontextprotocol/sdk
- React Native WebSocket support
- Proper type definitions
- Error handling utilities

## Next Steps

1. Create the directory structure
2. Implement the WebSocketTransport
3. Create the basic OnyxMCPClient
4. Test basic handshake
5. Document progress and challenges