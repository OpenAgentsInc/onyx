# Tool Support for Llama Chat Model

This document outlines the implementation plan for adding tool support to the llama chat model in Onyx, following the Model Context Protocol (MCP) specification.

## Overview

Tool support will allow the llama model to perform actions through a standardized interface following the MCP tools specification. The implementation will be local-first, with potential for remote tool execution in the future via WebSocket.

## MCP Tool Interface

### Tool Definition
```typescript
interface Tool {
  name: string;          // Required: Unique identifier for the tool
  description?: string;  // Optional: Human-readable description
  inputSchema: {         // Required: JSON Schema for parameters
    type: "object",
    properties: {        // Tool-specific parameters
      [key: string]: {
        type: string,
        description?: string,
        // Additional JSON Schema properties
      }
    },
    required?: string[]  // Array of required parameter names
  }
}
```

### Tool Request/Response
```typescript
// Tool Call Request
interface CallToolRequest {
  method: "tools/call";
  params: {
    name: string;      // Tool name to call
    arguments?: any;   // Tool parameters matching inputSchema
  }
}

// Tool Call Response
interface CallToolResult {
  content: Array<{     // Required: Array of content items
    type: "text" | "image" | "resource";
    text?: string;     // For text content
    data?: string;     // For base64 image data
    mimeType?: string; // For images/resources
    resource?: {       // For embedded resources
      uri: string;
      text?: string;
      blob?: string;
    }
  }>;
  isError?: boolean;   // Optional: true if tool execution failed
  _meta?: any;        // Optional: Additional metadata
}
```

## Architecture

### ToolService
```typescript
interface ToolService {
  // Tool registration and management
  registerTool(tool: Tool): void;
  unregisterTool(name: string): void;
  listTools(): Tool[];
  
  // Tool execution
  executeTool(name: string, params: any): Promise<CallToolResult>;
  
  // Tool validation
  validateToolInput(name: string, params: any): boolean;
  
  // MCP protocol methods
  handleToolsListRequest(): Promise<ListToolsResult>;
  handleToolCallRequest(request: CallToolRequest): Promise<CallToolResult>;
}
```

### Integration with LlamaContext

The ToolService will be integrated with LlamaContext to:
1. Expose available tools via system prompt
2. Parse and validate tool calls from model output
3. Execute tools and incorporate results into conversation
4. Handle tool errors appropriately

## Implementation Plan

1. Create base ToolService class in app/services/tools/
2. Implement MCP-compliant tool interfaces
3. Add tool registration and validation logic
4. Implement basic tools:
   - Calculator
   - Time/date functions
   - File system operations
   - Web search (if available)
5. Integrate with LlamaContext
6. Add UI components for tool management

## Tool Definition Example

```typescript
const calculatorTool: Tool = {
  name: "calculator",
  description: "Perform basic mathematical calculations",
  inputSchema: {
    type: "object",
    properties: {
      expression: {
        type: "string",
        description: "Mathematical expression to evaluate"
      }
    },
    required: ["expression"]
  }
};
```

## System Prompt Integration

Tools will be described to the model via system prompt following MCP format:

```
Available tools:

calculator: Perform basic mathematical calculations
Input schema: {
  "type": "object",
  "properties": {
    "expression": {
      "type": "string",
      "description": "Mathematical expression to evaluate"
    }
  },
  "required": ["expression"]
}

To use a tool, respond with:
<tool>
{
  "name": "calculator",
  "arguments": {
    "expression": "2 + 2"
  }
}
</tool>
```

## Error Handling

Following MCP spec:
1. Tool execution errors are returned in the result object with isError: true
2. Tool not found/validation errors are returned as MCP protocol errors
3. Results always include content array with error details
4. Error messages are LLM-friendly to allow self-correction

Example error response:
```typescript
{
  content: [{
    type: "text",
    text: "Error: Invalid expression '2 +'- Expression is incomplete"
  }],
  isError: true
}
```

## Security Considerations

1. Input validation using JSON Schema
2. Tool execution permissions
3. Resource usage limits
4. Sandboxing for file/system operations
5. Rate limiting for network operations

## Directory Structure

```
app/
├── services/
│   ├── tools/
│   │   ├── ToolService.ts       # Core tool service
│   │   ├── ToolRegistry.ts      # Tool registration
│   │   ├── ToolValidator.ts     # Input validation
│   │   ├── ToolExecutor.ts      # Tool execution
│   │   ├── tools/              # Built-in tools
│   │   │   ├── calculator.ts
│   │   │   ├── datetime.ts
│   │   │   └── filesystem.ts
│   │   └── types.ts            # Type definitions
│   └── llama/
│       └── LlamaContext.ts      # Updated with tool support
```

## WebSocket Integration

The WebSocket service will be extended to support MCP tool protocol:

```typescript
// In WebSocketService.ts
interface WebSocketService {
  // Existing methods...
  
  // Tool methods
  listTools(): Promise<ListToolsResult>;
  callTool(name: string, params: any): Promise<CallToolResult>;
  
  // Tool change notifications
  onToolListChanged(handler: () => void): () => void;
}
```

## Next Steps

1. Create MCP-compliant ToolService implementation
2. Add basic tools with proper schemas
3. Update LlamaContext for tool support
4. Implement tool parsing and execution
5. Add WebSocket protocol support
6. Add tool management UI

## MCP Compliance Notes

1. All tool definitions must include required inputSchema
2. Tool results must return content array
3. Error handling follows MCP conventions
4. Support for tool list change notifications
5. Proper JSON-RPC message formatting
6. Support for pagination in tool listing
7. Tool descriptions are optional but recommended
8. Support for metadata in responses