# Tool Support for Llama Chat Model

This document outlines the implementation of tool support in the Onyx mobile app, following the Model Context Protocol (MCP) specification.

## Overview

Tool support allows the llama model to perform actions through a standardized interface following the MCP tools specification. The implementation is local-first, with filesystem operations handled via WebSocket connection to Pylon.

## Current Implementation

### Tool Service
Located in `app/services/tools/ToolService.ts`:
```typescript
export class ToolService {
  private tools: Map<string, Tool> = new Map();
  private wsService: WebSocketService;

  // Tool registration and management
  registerTool(tool: Tool): void;
  unregisterTool(name: string): void;
  listTools(): Tool[];
  
  // Tool execution
  executeTool(name: string, params: any): Promise<ToolResult>;
  
  // Tool validation
  validateToolInput(name: string, params: any): boolean;
}
```

### Available Tools

Currently implemented filesystem tools:

1. list_directory
```typescript
{
  name: "list_directory",
  description: "List contents of a directory",
  inputSchema: {
    type: "object",
    properties: {
      path: {
        type: "string",
        description: "Directory path to list (relative to workspace root)"
      }
    },
    required: ["path"]
  }
}
```

2. read_file
```typescript
{
  name: "read_file",
  description: "Read contents of a file",
  inputSchema: {
    type: "object",
    properties: {
      path: {
        type: "string",
        description: "File path to read (relative to workspace root)"
      }
    },
    required: ["path"]
  }
}
```

### Integration with Chat

The tool system is integrated into the chat flow through several components:

1. System Prompt (in `app/features/llama/constants.ts`):
```typescript
export const SYSTEM_MESSAGE = {
  role: 'system',
  content: `...
You have access to the following tools:

list_directory: List contents of a directory
Input schema: {
  "type": "object",
  "properties": {
    "path": {
      "type": "string",
      "description": "Directory path to list"
    }
  },
  "required": ["path"]
}

read_file: Read contents of a file...
...`
}
```

2. Tool Execution Hook (in `app/hooks/useToolExecution.ts`):
```typescript
export const useToolExecution = (toolService: ToolService) => {
  // Process text for tool calls and execute them
  const processToolCalls = async (text: string): Promise<string>;
  
  // Process a message and handle any tool calls
  const processMessage = async (
    message: ChatMessage,
    addMessage: (msg: ChatMessage) => void
  ): Promise<ChatMessage>;
};
```

3. Tool-Enabled Chat Container (in `app/components/chat/ToolEnabledChatContainer.tsx`):
- Integrates with WebSocket service
- Handles tool execution in chat flow
- Processes model responses for tool calls
- Manages tool results in conversation

## Flow Example

When a user asks about files/directories:

1. User Input:
```
"What files are in the root directory?"
```

2. Model Response with Tool Call:
```
Let me check the contents of the root directory.
<tool>
{
  "name": "list_directory",
  "arguments": {
    "path": "."
  }
}
</tool>
```

3. Tool Execution Result:
```
Contents of .:
📁 app
📁 docs
📁 assets
📄 README.md
```

4. Final Model Response:
```
The root directory contains:
- Three folders: 'app', 'docs', and 'assets'
- A README.md file
```

## Error Handling

1. Tool Execution Errors:
- Invalid parameters
- File/directory not found
- Permission issues
- Network errors (WebSocket)

2. Error Response Format:
```typescript
{
  content: [{
    type: "text",
    text: "Error: Invalid path 'nonexistent/path'"
  }],
  isError: true
}
```

## Directory Structure

```
app/
├── services/
│   ├── tools/
│   │   ├── ToolService.ts       # Core tool service
│   │   ├── types.ts            # Tool interfaces
│   │   └── index.ts            # Exports
│   └── llama/
│       └── LlamaContext.ts      # Updated with tool support
├── hooks/
│   └── useToolExecution.ts     # Tool execution hook
└── components/
    └── chat/
        └── ToolEnabledChatContainer.tsx  # Chat with tools
```

## WebSocket Integration

Tools communicate with Pylon via WebSocket for filesystem operations:

```typescript
// In WebSocketService.ts
interface WebSocketService {
  // Resource methods used by tools
  listResources(path: string): Promise<Resource[]>;
  readResource(path: string): Promise<ResourceContent>;
}
```

## Future Improvements

1. Additional Tools:
   - File search
   - File write/create
   - Directory creation
   - File metadata

2. Enhanced Features:
   - Tool result caching
   - Progress reporting
   - Batch operations
   - Tool composition

3. Security:
   - Path validation
   - Access control
   - Rate limiting
   - Resource limits

4. UI Improvements:
   - Tool usage indicators
   - Progress visualization
   - Error displays
   - Tool management interface

## Testing

To test the tool system:

1. Prerequisites:
   - Pylon server running
   - WebSocket connection established
   - Model loaded in Onyx

2. Test Cases:
   - Directory listing
   - File reading
   - Error handling
   - Tool parameter validation

3. Example Commands:
   ```
   "Show me what's in the docs folder"
   "What's in the README.md file?"
   "List all TypeScript files in the app directory"
   ```