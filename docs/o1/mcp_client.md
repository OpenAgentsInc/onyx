## Relevant Files & Their Roles

1. **`app/config/env.ts`**
   - Define `MCP_SERVER_URL` here, pointing to the demo MCP server’s endpoint.
   - Example:
     ```typescript
     export const MCP_SERVER_URL = "ws://localhost:3000"; // or your server's actual URL
     ```

2. **`app/services/mcp/client/OnyxMCPClient.ts`**
   - Create and configure the `MCPClient` instance.
   - Use `MCP_SERVER_URL` from env/config.
   - Implement `connect()` method that:
     - Instantiates `WebSocketTransport`.
     - Calls `client.connect(transport)` from the MCP SDK.
   - Provide methods like `listResources()`, `readResource(uri)`, etc., that internally call the MCP `request()` methods.

   ```typescript
   import { MCPClient } from "@modelcontextprotocol/typescript-sdk";
   import { WebSocketTransport } from "../transport/WebSocketTransport";
   import { MCP_SERVER_URL } from "../../../config/env";

   export class OnyxMCPClient {
     private client: MCPClient;

     constructor() {
       this.client = new MCPClient(
         { name: "onyx-mobile", version: "1.0.0" },
         { capabilities: { sampling: {}, roots: { listChanged: true } } }
       );
     }

     async connect() {
       const transport = new WebSocketTransport({ url: MCP_SERVER_URL });
       await this.client.connect(transport);
     }

     async listResources() {
       return await this.client.request({ method: "resources/list" });
     }

     // ... other MCP calls like readResource, listPrompts, callTool, etc.
   }


3. **`app/services/mcp/transport/WebSocketTransport.ts`**
   - Implements a `Transport` interface for JSON-RPC over WebSocket.
   - Uses the MCP schema’s JSON-RPC format to send/receive messages.
   - Connect to the `MCP_SERVER_URL`, handle `onmessage` to parse JSON-RPC messages and call `onmessage` callback.
   - Implement `send(message: JSONRPCMessage)` to stringify and send over WebSocket.
   - Implement error handling and `start()`, `close()` methods.

   ```typescript
   import { Transport } from "@modelcontextprotocol/typescript-sdk";
   import { JSONRPCMessage } from "@modelcontextprotocol/typescript-sdk";

   interface WebSocketTransportOptions {
     url: string;
   }

   export class WebSocketTransport implements Transport {
     private ws: WebSocket;
     onclose?: () => void;
     onerror?: (error: Error) => void;
     onmessage?: (message: JSONRPCMessage) => void;

     constructor(private options: WebSocketTransportOptions) {}

     async start() {
       return new Promise<void>((resolve, reject) => {
         this.ws = new WebSocket(this.options.url);
         this.ws.onopen = () => resolve();
         this.ws.onerror = (e) => reject(new Error(`WebSocket error: ${e}`));
         this.ws.onmessage = (msg) => {
           const data = JSON.parse(msg.data);
           this.onmessage?.(data);
         };
         this.ws.onclose = () => this.onclose?.();
       });
     }

     async send(message: JSONRPCMessage) {
       this.ws.send(JSON.stringify(message));
     }

     async close() {
       this.ws.close();
     }
   }

4. **`app/services/mcp/hooks/useMCPClient.ts`**
   - A React hook that:
     - Instantiates `OnyxMCPClient`.
     - Calls `client.connect()` on mount.
     - Provides the connected `OnyxMCPClient` instance to components.

   ```typescript
   import { useEffect, useState } from "react";
   import { OnyxMCPClient } from "../client/OnyxMCPClient";

   export function useMCPClient() {
     const [client, setClient] = useState<OnyxMCPClient | null>(null);
     const [error, setError] = useState<Error | null>(null);

     useEffect(() => {
       const c = new OnyxMCPClient();
       c.connect().then(() => {
         setClient(c);
       }).catch(err => setError(err));
     }, []);

     return { client, error };
   }

5. **`app/services/mcp/hooks/useMCPResource.ts`**
   - Uses `useMCPClient()` to get the client.
   - Fetches a resource (e.g., via `client.listResources()`).
   - Optionally caches result in `MCPResourcesStore` or uses `ResourceCache`.
   - Returns `resource`, `loading`, `error` to components.

6. **`MCPResourcesStore.ts` (in `app/models`)**
   - Optional MST store to keep fetched MCP resources and manage state.
   - Could store arrays of resources returned by `listResources()` or hold selected resource content after `readResource()` calls.

## Connecting to the Demo MCP Server

- Ensure the demo MCP server is running and accessible at `MCP_SERVER_URL`.
- Set the `MCP_SERVER_URL` in `env.ts`.
- In `OnyxMCPClient.ts`, use `MCP_SERVER_URL` to connect via `WebSocketTransport`.
- On the server side, ensure it is started in a mode that listens for incoming MCP JSON-RPC over stdio or WebSocket (based on your chosen configuration).

## Summary

To make Onyx an MCP client:

1. **Configure Environment**: Set `MCP_SERVER_URL` in `app/config/env.ts`.
2. **MCP Client**: Implemented in `OnyxMCPClient.ts`.
3. **Transport**: Implemented in `WebSocketTransport.ts`.
4. **Hooks (useMCPClient.ts & useMCPResource.ts)**: Provide easy access to MCP operations from React components.
5. **Stores (MCPResourcesStore.ts)**: Optionally manage and cache MCP data.
6. **Invoke MCP Calls in Screens**: Use `useMCPClient()` and `useMCPResource()` in a screen (e.g. `OnyxScreen.tsx`) to list resources, call tools, etc.

Once these pieces are in place, Onyx can connect to your MCP server (`groq-mcp-test`) and leverage its capabilities like listing resources, reading them, calling tools, and performing AI completions.
