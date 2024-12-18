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

    /**
     * OnyxMCPClient is a wrapper around the MCPClient that:
    * - Manages connection to the MCP server using a WebSocketTransport.
    * - Provides convenience methods to interact with the MCP server (e.g., listing resources, reading them, calling tools).
    * - Can be integrated with React hooks (e.g., useMCPClient) for easy usage in components.
    */
    export class OnyxMCPClient {
      private client: MCPClient;

      constructor() {
        // Set initial capabilities as needed. Here we declare sampling and roots for example,
        // adjust according to your server’s capabilities or requirements.
        this.client = new MCPClient(
          { name: "onyx-mobile", version: "1.0.0" },
          {
            capabilities: {
              sampling: {},
              roots: { listChanged: true },
            },
          }
        );
      }

      /**
       * Establishes a connection to the MCP server via WebSocket.
      * Reads the MCP_SERVER_URL from config to determine the connection endpoint.
      */
      async connect() {
        const transport = new WebSocketTransport({ url: MCP_SERVER_URL });
        await this.client.connect(transport);
      }

      /**
       * Example method: Lists resources available on the MCP server.
      * Returns a list of resources as defined by the MCP protocol.
      */
      async listResources() {
        return await this.client.request({ method: "resources/list" });
      }

      /**
       * Example method: Reads a specific resource by URI.
      * @param uri The resource URI to read from the server.
      */
      async readResource(uri: string) {
        return await this.client.request({
          method: "resources/read",
          params: { uri },
        });
      }

      /**
       * Example method: Calls a tool on the MCP server.
      * @param name The name of the tool to call.
      * @param args The arguments to pass to the tool.
      */
      async callTool(name: string, args: Record<string, any>) {
        return await this.client.request({
          method: "tools/call",
          params: { name, arguments: args },
        });
      }

      /**
       * Example method: Lists available prompts or prompt templates from the server.
      */
      async listPrompts() {
        return await this.client.request({ method: "prompts/list" });
      }

      /**
       * Example method: Gets a specific prompt by name.
      * @param name The prompt name.
      * @param promptArgs Optional arguments to template into the prompt.
      */
      async getPrompt(name: string, promptArgs?: Record<string, string>) {
        return await this.client.request({
          method: "prompts/get",
          params: { name, arguments: promptArgs },
        });
      }

      /**
       * Example method: Completes an argument’s value based on context (for autocompletion).
      * @param ref A prompt or resource reference where the argument is defined.
      * @param argumentName The argument name to complete.
      * @param argumentValue The current partial value of the argument.
      */
      async completeArgument(ref: { type: string; name?: string; uri?: string }, argumentName: string, argumentValue: string) {
        return await this.client.request({
          method: "completion/complete",
          params: {
            ref,
            argument: { name: argumentName, value: argumentValue },
          },
        });
      }

      /**
       * Example method: List tools available on the MCP server.
      */
      async listTools() {
        return await this.client.request({ method: "tools/list" });
      }

      // Add more convenience methods as needed for your workflow.
    }
    ```


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

    ```typescript
    // app/services/mcp/hooks/useMCPResource.ts
    import { useEffect, useState } from "react"
    import { useMCPClient } from "./useMCPClient"
    import { useStores } from "../../../models" // Assuming there's a root store with MST including MCPResourcesStore

    /**
     * A hook to fetch and manage resources from the MCP server.
    *
    * This hook:
    * - Gets the MCP client from useMCPClient.
    * - Optionally fetches a list of resources or a specific resource by URI.
    * - Updates the MCPResourcesStore with the fetched data.
    *
    * Usage:
    * const { resources, loading, error } = useMCPResource();
    * // or for a single resource:
    * const { resource, loading, error } = useMCPResource({ uri: "file:///my/resource" });
    */

    interface UseMCPResourceOptions {
      uri?: string; // If provided, fetch a single resource instead of listing all
    }

    export function useMCPResource(options?: UseMCPResourceOptions) {
      const { client } = useMCPClient()
      const { mcpResourcesStore } = useStores()
      const [loading, setLoading] = useState(true)
      const [error, setError] = useState<Error | null>(null)

      useEffect(() => {
        if (!client) return

        async function fetchData() {
          setLoading(true)
          setError(null)

          try {
            if (options?.uri) {
              // Fetch a single resource
              const result = await client.readResource(options.uri)
              // Assume the server returns an object with a `contents` array
              // and we take the first content as the main resource.
              if (result && (result as any).contents && (result as any).contents.length > 0) {
                mcpResourcesStore.setResource(options.uri, (result as any).contents[0])
              }
            } else {
              // List all resources
              const result = await client.listResources()
              // Assume `result.resources` is the array of resources
              if (result && (result as any).resources) {
                mcpResourcesStore.setResources((result as any).resources)
              }
            }
          } catch (err) {
            setError(err as Error)
          } finally {
            setLoading(false)
          }
        }

        fetchData()
      }, [client, options?.uri, mcpResourcesStore])

      if (options?.uri) {
        const resource = mcpResourcesStore.getResource(options.uri)
        return { resource, loading, error }
      } else {
        const resources = mcpResourcesStore.resources
        return { resources, loading, error }
      }
    }

6. **`MCPResourcesStore.ts` (in `app/models`)**
   - Optional MST store to keep fetched MCP resources and manage state.
   - Could store arrays of resources returned by `listResources()` or hold selected resource content after `readResource()` calls.

    ```typescript
    // app/services/mcp/MCPResourcesStore.ts
    import { Instance, SnapshotIn, SnapshotOut, types, cast } from "mobx-state-tree"

    /**
     * A model to represent a single resource as defined by the MCP server.
    * We'll assume a resource has:
    * - uri (as an identifier)
    * - name (string)
    * - description (optional string)
    * - mimeType (optional string)
    *
    * Adjust fields as needed based on actual MCP Resource definitions.
    */
    export const MCPResourceModel = types.model("MCPResource", {
      uri: types.identifier,
      name: types.string,
      description: types.maybe(types.string),
      mimeType: types.maybe(types.string)
    })

    type MCPResourceModelType = Instance<typeof MCPResourceModel>

    /**
     * The MCPResourcesStore maintains a list of resources and provides actions
    * to update them when fetching from the MCP server.
    */
    export const MCPResourcesStoreModel = types
      .model("MCPResourcesStore", {
        resources: types.array(MCPResourceModel),
      })
      .views((store) => ({
        getResource(uri: string) {
          return store.resources.find(r => r.uri === uri)
        },
      }))
      .actions((store) => ({
        setResources(resources: Array<{ uri: string; name: string; description?: string; mimeType?: string }>) {
          const modelResources = resources.map(r => ({
            uri: r.uri,
            name: r.name,
            description: r.description,
            mimeType: r.mimeType
          }))
          store.resources.replace(cast(modelResources))
        },
        setResource(uri: string, resourceData: { uri: string; name?: string; description?: string; mimeType?: string }) {
          // If a resource with this URI already exists, update it
          const existing = store.resources.findIndex(r => r.uri === uri)
          const resource = {
            uri,
            name: resourceData.name || "Unnamed Resource",
            description: resourceData.description,
            mimeType: resourceData.mimeType
          }
          if (existing >= 0) {
            store.resources[existing] = cast(resource)
          } else {
            store.resources.push(cast(resource))
          }
        },
        clearResources() {
          store.resources.clear()
        }
      }))

    export interface MCPResourcesStore extends Instance<typeof MCPResourcesStoreModel> {}
    export interface MCPResourcesStoreSnapshotOut extends SnapshotOut<typeof MCPResourcesStoreModel> {}
    export interface MCPResourcesStoreSnapshotIn extends SnapshotIn<typeof MCPResourcesStoreModel> {}

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
