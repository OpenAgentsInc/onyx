import { makeAutoObservable } from "mobx";
import { WebSocketService } from "../websocket/WebSocketService";
import { Tool, ToolResult, ListToolsResult, LIST_DIRECTORY_TOOL, READ_FILE_TOOL } from "./types";

export class ToolService {
  private tools: Map<string, Tool> = new Map();
  private wsService: WebSocketService;

  constructor(wsService: WebSocketService) {
    this.wsService = wsService;
    makeAutoObservable(this);
    this.initializeTools();
  }

  private initializeTools() {
    // Register built-in filesystem tools
    this.registerTool(LIST_DIRECTORY_TOOL);
    this.registerTool(READ_FILE_TOOL);
  }

  // Tool registration
  registerTool(tool: Tool): void {
    if (this.tools.has(tool.name)) {
      throw new Error(`Tool "${tool.name}" is already registered`);
    }
    this.tools.set(tool.name, tool);
  }

  unregisterTool(name: string): void {
    if (!this.tools.has(name)) {
      throw new Error(`Tool "${name}" is not registered`);
    }
    this.tools.delete(name);
  }

  // Tool listing
  async handleToolsListRequest(): Promise<ListToolsResult> {
    return {
      tools: Array.from(this.tools.values())
    };
  }

  // Tool execution
  async executeTool(name: string, params: any): Promise<ToolResult> {
    const tool = this.tools.get(name);
    if (!tool) {
      return {
        content: [{
          type: "text",
          text: `Error: Tool "${name}" not found`
        }],
        isError: true
      };
    }

    try {
      // Validate params against schema
      if (!this.validateToolInput(name, params)) {
        return {
          content: [{
            type: "text",
            text: `Error: Invalid parameters for tool "${name}"`
          }],
          isError: true
        };
      }

      // Execute the appropriate tool
      switch (name) {
        case "list_directory":
          return this.executeListDirectory(params.path);
        case "read_file":
          return this.executeReadFile(params.path);
        default:
          return {
            content: [{
              type: "text",
              text: `Error: Tool "${name}" execution not implemented`
            }],
            isError: true
          };
      }
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error executing tool "${name}": ${error.message}`
        }],
        isError: true
      };
    }
  }

  // Tool validation
  validateToolInput(name: string, params: any): boolean {
    const tool = this.tools.get(name);
    if (!tool) return false;

    // Check required parameters
    if (tool.inputSchema.required) {
      for (const required of tool.inputSchema.required) {
        if (!(required in params)) {
          return false;
        }
      }
    }

    // Check parameter types
    for (const [key, value] of Object.entries(params)) {
      const schema = tool.inputSchema.properties[key];
      if (!schema) return false;

      // Basic type checking
      switch (schema.type) {
        case "string":
          if (typeof value !== "string") return false;
          break;
        case "number":
          if (typeof value !== "number") return false;
          break;
        case "boolean":
          if (typeof value !== "boolean") return false;
          break;
        // Add more types as needed
      }
    }

    return true;
  }

  // Filesystem tool implementations
  private async executeListDirectory(path: string): Promise<ToolResult> {
    try {
      const resources = await this.wsService.listResources(path);
      
      // Format the directory listing
      const listing = resources.map(resource => {
        const isDirectory = !resource.mime_type;
        return `${isDirectory ? "📁" : "📄"} ${resource.name}`;
      }).join("\\n");

      return {
        content: [{
          type: "text",
          text: `Contents of ${path}:\\n${listing}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error listing directory "${path}": ${error.message}`
        }],
        isError: true
      };
    }
  }

  private async executeReadFile(path: string): Promise<ToolResult> {
    try {
      const result = await this.wsService.readResource(path);
      
      if (!result.contents || result.contents.length === 0) {
        return {
          content: [{
            type: "text",
            text: `Error: No content found for file "${path}"`
          }],
          isError: true
        };
      }

      const content = result.contents[0];
      
      // Handle text content
      if ("text" in content) {
        return {
          content: [{
            type: "text",
            text: content.text
          }]
        };
      }
      
      // Handle binary content
      if ("blob" in content) {
        return {
          content: [{
            type: "text",
            text: `File "${path}" contains binary data (${content.mimeType})`
          }]
        };
      }

      return {
        content: [{
          type: "text",
          text: `Error: Unsupported content type for file "${path}"`
        }],
        isError: true
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error reading file "${path}": ${error.message}`
        }],
        isError: true
      };
    }
  }
}