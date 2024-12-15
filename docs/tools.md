# Tool Support for Llama Chat Model

This document outlines the implementation plan for adding tool support to the llama chat model in Onyx.

## Overview

Tool support will allow the llama model to perform actions through a standardized interface, similar to the Model Context Protocol (MCP) tools concept. The implementation will be local-first, with potential for remote tool execution in the future.

## Architecture

### Tool Service
```typescript
interface Tool {
  name: string;          // Unique identifier
  description: string;   // Human-readable description
  inputSchema: {         // JSON Schema for parameters
    type: "object",
    properties: {...}    // Tool-specific parameters
  }
}

interface ToolService {
  // Tool registration and management
  registerTool(tool: Tool): void;
  unregisterTool(name: string): void;
  listTools(): Tool[];
  
  // Tool execution
  executeTool(name: string, params: any): Promise<any>;
  
  // Tool validation
  validateToolInput(name: string, params: any): boolean;
}
```

### Integration with LlamaContext

The ToolService will be integrated with LlamaContext to allow the model to:
1. Know about available tools via system prompt
2. Parse and validate tool calls from model output
3. Execute tools and incorporate results into conversation

## Implementation Plan

1. Create base ToolService class in app/services/tools/
2. Add tool registration and validation logic
3. Implement basic tools:
   - Calculator
   - Time/date functions
   - File system operations
   - Web search (if available)
4. Integrate with LlamaContext:
   - Add tools to system prompt
   - Parse tool calls from model output
   - Handle tool execution results
5. Add UI components for tool management

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

Tools will be described to the model via system prompt:

```
Available tools:
- calculator: Perform basic mathematical calculations
  Input: {"expression": "2 + 2"}
  Output: {"result": 4}

To use a tool, respond with:
<tool>
{
  "name": "calculator",
  "params": {
    "expression": "2 + 2"
  }
}
</tool>
```

## Error Handling

1. Input validation errors
2. Tool execution errors
3. Tool not found errors
4. Permission/security errors

## Security Considerations

1. Input validation and sanitization
2. Tool execution permissions
3. Resource usage limits
4. Sandboxing for file/system operations

## Future Enhancements

1. Remote tool execution via WebSocket
2. Tool composition/chaining
3. Async tool execution
4. Tool result caching
5. Custom tool UI components
6. Tool usage analytics

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

## Integration with WebSocket Service

The existing WebSocket service can be extended to support remote tool execution in the future:

```typescript
// In WebSocketService.ts
executeTool = async (name: string, params: any) => {
  return this.sendAndWait({
    jsonrpc: '2.0',
    method: 'tool/execute',
    params: { name, params }
  });
};
```

## Next Steps

1. Create ToolService implementation
2. Add basic tools
3. Update LlamaContext for tool support
4. Test with simple tools
5. Add more complex tools
6. Implement UI for tool management