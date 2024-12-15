import { Role } from "@/types/websocket";

export interface Tool {
  name: string;
  description?: string;
  inputSchema: {
    type: "object";
    properties: {
      [key: string]: {
        type: string;
        description?: string;
        // Additional JSON Schema properties as needed
      };
    };
    required?: string[];
  };
}

export interface ToolContent {
  type: "text" | "image" | "resource";
  text?: string;
  data?: string;
  mimeType?: string;
  resource?: {
    uri: string;
    text?: string;
    blob?: string;
  };
  annotations?: {
    audience?: Role[];
    priority?: number;
  };
}

export interface ToolResult {
  content: ToolContent[];
  isError?: boolean;
  _meta?: any;
}

export interface ListToolsResult {
  tools: Tool[];
  nextCursor?: string;
  _meta?: any;
}

// Filesystem tool definitions
export const LIST_DIRECTORY_TOOL: Tool = {
  name: "list_directory",
  description: "List contents of a directory. Use '.' for current directory, '..' for parent directory, or a relative path like 'docs' or 'app/components'.",
  inputSchema: {
    type: "object",
    properties: {
      path: {
        type: "string",
        description: "Directory path relative to workspace root. Use '.' for current directory."
      }
    },
    required: ["path"]
  }
};

export const READ_FILE_TOOL: Tool = {
  name: "read_file",
  description: "Read contents of a file using relative paths like 'README.md' or 'docs/tools.md'.",
  inputSchema: {
    type: "object",
    properties: {
      path: {
        type: "string",
        description: "File path relative to workspace root"
      }
    },
    required: ["path"]
  }
};