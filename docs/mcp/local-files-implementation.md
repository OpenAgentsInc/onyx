# Local Files MCP Server Implementation Plan

## Overview

This document outlines the plan for implementing a local files MCP server that will provide access to specific repositories, and connecting it to the Onyx MCP client.

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Onyx Client   │     │   MCP Client     │     │ Local Files     │
│   (React Native)│────▶│   (TypeScript)   │────▶│  MCP Server     │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                         │
                                                         ▼
                                                 ┌─────────────────┐
                                                 │  Local Storage  │
                                                 │   (Repository   │
                                                 │    Access)      │
                                                 └─────────────────┘
```

## 1. Local Files MCP Server

### Core Features
- Repository listing
- File/directory browsing
- File content access
- Basic search capabilities
- Permission management

### Implementation

```typescript
// src/mcp/servers/local-files/index.ts
import { Server } from "@modelcontextprotocol/sdk/server";

interface RepoConfig {
  path: string;
  name: string;
  permissions: string[];
}

class LocalFilesMCPServer extends Server {
  private repos: RepoConfig[];
  
  constructor(config: { repos: RepoConfig[] }) {
    super({
      name: "local-files",
      version: "1.0.0",
      capabilities: {
        "resources/list": true,
        "resources/read": true,
        "resources/search": true
      }
    });
    this.repos = config.repos;
  }

  async handleResourcesList() {
    return {
      resources: this.repos.map(repo => ({
        uri: `repo://${repo.name}`,
        name: repo.name,
        type: "directory"
      }))
    };
  }

  async handleResourceRead(uri: string) {
    // Implement file/directory reading logic
  }

  async handleResourceSearch(query: string) {
    // Implement search across repos
  }
}
```

### Security Model

1. **Repository Access Control**
```typescript
interface AccessControl {
  validateAccess(repo: string, path: string): Promise<boolean>;
  enforcePermissions(user: string, action: string): Promise<void>;
}
```

2. **Path Sanitization**
```typescript
function sanitizePath(path: string): string {
  // Prevent directory traversal
  // Normalize paths
  // Validate against allowed paths
}
```

## 2. MCP Client Integration

### Client Setup

```typescript
// src/mcp/client/index.ts
import { Client } from "@modelcontextprotocol/sdk/client";

export class OnyxMCPClient {
  private client: Client;
  private transport: WebSocketTransport;

  constructor() {
    this.client = new Client({
      name: "onyx-mobile",
      version: "1.0.0"
    }, {
      capabilities: {
        "resources/list": true,
        "resources/read": true,
        "resources/search": true
      }
    });
  }

  async connect(serverUrl: string) {
    this.transport = new WebSocketTransport({
      url: serverUrl,
      options: {
        reconnect: true,
        backoff: "exponential"
      }
    });
    await this.client.connect(this.transport);
  }

  async listRepositories() {
    return await this.client.request(
      { method: "resources/list" },
      ListResourcesResultSchema
    );
  }

  async readFile(uri: string) {
    return await this.client.request({
      method: "resources/read",
      params: { uri }
    }, ReadResourceResultSchema);
  }
}
```

### Mobile Optimizations

1. **Connection Management**
```typescript
class ConnectionManager {
  private reconnectAttempts: number = 0;
  
  async handleDisconnect() {
    // Implement exponential backoff
    // Handle background/foreground transitions
  }

  async optimizeForNetwork(type: "wifi" | "cellular" | "offline") {
    // Adjust batch sizes and polling intervals
  }
}
```

2. **Caching Layer**
```typescript
class ResourceCache {
  private cache: Map<string, CachedResource>;
  
  async get(uri: string): Promise<CachedResource | null> {
    // Implement TTL-based caching
    // Handle stale data
  }
}
```

## 3. Implementation Phases

### Phase 1: Basic Setup
1. Create LocalFilesMCPServer with basic file listing
2. Implement OnyxMCPClient with connection handling
3. Test basic connectivity and resource listing

### Phase 2: Core Features
1. Add file content access
2. Implement directory browsing
3. Add basic search functionality
4. Set up permission system

### Phase 3: Mobile Optimization
1. Implement connection management
2. Add caching layer
3. Optimize for battery life
4. Handle offline mode

### Phase 4: Security & Polish
1. Complete security implementation
2. Add error handling
3. Implement retry logic
4. Add monitoring and logging

## 4. Testing Plan

### Unit Tests
```typescript
describe("LocalFilesMCPServer", () => {
  it("should list configured repositories", async () => {
    // Test repo listing
  });

  it("should handle file reading", async () => {
    // Test file access
  });
});
```

### Integration Tests
```typescript
describe("OnyxMCPClient with LocalFilesMCPServer", () => {
  it("should connect and list repos", async () => {
    // Test full connection flow
  });

  it("should handle disconnections gracefully", async () => {
    // Test reconnection logic
  });
});
```

### Mobile-Specific Tests
1. Background/foreground transitions
2. Network changes
3. Memory usage monitoring
4. Battery impact testing

## 5. Usage Example

```typescript
// Initialize server
const server = new LocalFilesMCPServer({
  repos: [{
    path: "/path/to/repo1",
    name: "repo1",
    permissions: ["read"]
  }]
});

// Start server
await server.listen(8080);

// Initialize client
const client = new OnyxMCPClient();
await client.connect("ws://localhost:8080");

// List repositories
const repos = await client.listRepositories();

// Read file
const content = await client.readFile("repo://repo1/README.md");
```

## Next Steps

1. Create basic server implementation
2. Test with simple file access
3. Implement client wrapper
4. Add security measures
5. Optimize for mobile
6. Add caching and offline support

## Resources

- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [React Native File Access](https://reactnative.dev/docs/security)
- [WebSocket Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Mobile Performance Guide](https://reactnative.dev/docs/performance)