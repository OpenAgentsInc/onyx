# MCP TypeScript SDK Integration

## Overview

The MCP TypeScript SDK provides a complete implementation of the Model Context Protocol for both client and server capabilities. For Onyx, we'll primarily focus on the client implementation to connect with MCP-compatible services.

## Installation

```bash
npm install @modelcontextprotocol/sdk
```

## Client Implementation

### Basic Setup

```typescript
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const client = new Client({
  name: "onyx-mobile",
  version: "1.0.0",
}, {
  capabilities: {}
});
```

### Core Features

1. **Resource Management**
   ```typescript
   // List available resources
   const resources = await client.request(
     { method: "resources/list" },
     ListResourcesResultSchema
   );

   // Read specific resource
   const resourceContent = await client.request({
     method: "resources/read",
     params: { uri: "file:///example.txt" }
   }, ReadResourceResultSchema);
   ```

2. **Transport Options**
   - stdio (Standard I/O)
   - SSE (Server-Sent Events)
   - Custom transport implementations possible

3. **Message Handling**
   - Protocol message management
   - Lifecycle event handling
   - Error handling

## Integration with Onyx

### Key Considerations

1. **React Native Compatibility**
   - Test transport mechanisms in React Native environment
   - Verify WebSocket/SSE support
   - Handle mobile-specific networking constraints

2. **State Management**
   - Integrate with Onyx's existing state management
   - Handle connection persistence
   - Cache resource data appropriately

3. **Error Handling**
   - Implement robust error recovery
   - Handle network disconnections
   - Provide user feedback

### Implementation Steps

1. Create MCP client wrapper:
   ```typescript
   class OnyxMCPClient {
     private client: Client;
     
     constructor() {
       this.client = new Client({
         name: "onyx-mobile",
         version: "1.0.0"
       }, {
         capabilities: {}
       });
     }

     async connect(serverUrl: string) {
       // Implement connection logic
     }

     async listResources() {
       // Implement resource listing
     }

     async readResource(uri: string) {
       // Implement resource reading
     }
   }
   ```

2. Handle transport setup:
   ```typescript
   // Example SSE transport setup
   const transport = new SSETransport({
     url: serverUrl,
     options: {
       // Configure for mobile environment
     }
   });
   ```

3. Implement error handling:
   ```typescript
   try {
     await client.connect(transport);
   } catch (error) {
     // Handle connection errors
     console.error('MCP connection failed:', error);
   }
   ```

## Testing

1. **Unit Tests**
   - Test client initialization
   - Mock transport responses
   - Verify error handling

2. **Integration Tests**
   - Test with real MCP servers
   - Verify resource access
   - Check performance on mobile

3. **Mobile-Specific Tests**
   - Background/foreground transitions
   - Network changes
   - Memory usage

## Resources

- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Example Servers](https://github.com/modelcontextprotocol/servers)
- [Protocol Documentation](https://modelcontextprotocol.io)
- [SDK NPM Package](https://www.npmjs.com/package/@modelcontextprotocol/sdk)