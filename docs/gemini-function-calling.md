# Gemini Function Calling Integration

This document describes how we implement and use Gemini's function calling capabilities in Onyx.

## Overview

Function calling allows Gemini to interact with external tools and APIs in a structured way. The model doesn't directly execute functions but generates structured output specifying which functions to call with what arguments.

## Implementation

### Core Components

1. **Function Declarations**
```typescript
interface FunctionDeclaration {
  name: string
  description: string
  parameters: {
    type: string
    properties: Record<string, {
      type: string
      description: string
      enum?: string[]
      required?: boolean
    }>
    required?: string[]
  }
}
```

2. **Tool Configuration**
```typescript
interface ToolConfig {
  function_calling_config: {
    mode: "AUTO" | "ANY" | "NONE"
    allowed_function_names?: string[]
  }
}
```

3. **Function Call Response**
```typescript
interface FunctionCall {
  name: string
  args: Record<string, unknown>
}
```

### Integration with Tool Store

Our tool system integrates with Gemini's function calling through:

1. **Tool Registration**
```typescript
// Convert Tool to FunctionDeclaration
const toolToFunctionDeclaration = (tool: Tool): FunctionDeclaration => ({
  name: tool.name,
  description: tool.description,
  parameters: {
    type: "object",
    properties: tool.parameters,
    required: Object.entries(tool.parameters)
      .filter(([_, param]) => param.required)
      .map(([name]) => name)
  }
})
```

2. **Function Call Handling**
```typescript
const handleFunctionCall = async (functionCall: FunctionCall) => {
  const tool = toolStore.getTool(functionCall.name)
  if (!tool) throw new Error(`Tool ${functionCall.name} not found`)
  return await tool.execute(functionCall.args)
}
```

## Usage

### Basic Function Calling

```typescript
const geminiApi = new GeminiChatApi(config)

const response = await geminiApi.createChatCompletion({
  messages: [{
    role: "user",
    content: "Show me the contents of README.md"
  }],
  tools: [githubTools.viewFile],
  tool_config: {
    function_calling_config: {
      mode: "AUTO" // Let model decide whether to use tools
    }
  }
})
```

### Forced Function Calling

```typescript
const response = await geminiApi.createChatCompletion({
  messages: [{
    role: "user", 
    content: "What files are in the src directory?"
  }],
  tools: [githubTools.viewHierarchy],
  tool_config: {
    function_calling_config: {
      mode: "ANY", // Force tool use
      allowed_function_names: ["view_hierarchy"]
    }
  }
})
```

### Multi-Turn Conversations

```typescript
const messages = [
  {
    role: "user",
    content: "Show me the README and suggest improvements"
  },
  {
    role: "assistant",
    content: null,
    function_call: {
      name: "view_file",
      args: {
        path: "README.md",
        owner: "OpenAgentsInc",
        repo: "onyx",
        branch: "main"
      }
    }
  },
  {
    role: "function",
    name: "view_file",
    content: "# Content of README.md..."
  }
]

const response = await geminiApi.createChatCompletion({
  messages,
  tools: [githubTools.viewFile],
  tool_config: {
    function_calling_config: { mode: "AUTO" }
  }
})
```

## Function Calling Modes

1. **AUTO** (Default)
   - Model decides whether to use tools
   - Best for general use cases
   - Example: "Tell me about this codebase"

2. **ANY**
   - Forces model to use tools
   - Best when tool use is required
   - Example: "Show me the file contents"

3. **NONE**
   - Disables tool use
   - Best for pure conversation
   - Example: "Explain how functions work"

## Best Practices

### 1. Function Declarations

- Use clear, descriptive names
- Provide detailed descriptions
- Define parameter types strictly
- Include examples in descriptions
- Mark required parameters

### 2. Error Handling

```typescript
try {
  const result = await handleFunctionCall(functionCall)
  return {
    role: "function",
    name: functionCall.name,
    content: JSON.stringify(result)
  }
} catch (error) {
  return {
    role: "function",
    name: functionCall.name,
    content: JSON.stringify({
      error: true,
      message: error.message
    })
  }
}
```

### 3. Parameter Validation

```typescript
const validateParams = (
  params: Record<string, unknown>,
  declaration: FunctionDeclaration
) => {
  const { required = [], properties } = declaration.parameters
  
  // Check required params
  for (const param of required) {
    if (!(param in params)) {
      throw new Error(`Missing required parameter: ${param}`)
    }
  }

  // Validate types
  for (const [name, value] of Object.entries(params)) {
    const schema = properties[name]
    if (!schema) {
      throw new Error(`Unknown parameter: ${name}`)
    }
    
    // Type checking
    if (typeof value !== schema.type) {
      throw new Error(
        `Invalid type for ${name}: expected ${schema.type}, got ${typeof value}`
      )
    }
    
    // Enum validation
    if (schema.enum && !schema.enum.includes(value as string)) {
      throw new Error(
        `Invalid value for ${name}: must be one of ${schema.enum.join(", ")}`
      )
    }
  }
}
```

### 4. Response Formatting

```typescript
const formatToolResponse = (result: unknown) => {
  if (typeof result === "string") return result
  return JSON.stringify(result, null, 2)
}
```

## Security Considerations

1. **Parameter Validation**
   - Validate all inputs
   - Check types strictly
   - Sanitize string inputs
   - Validate enum values

2. **Permission Checking**
   - Verify tool access rights
   - Check repository permissions
   - Validate API tokens
   - Log access attempts

3. **Rate Limiting**
   - Implement per-tool limits
   - Track usage metrics
   - Handle rate limit errors
   - Add backoff logic

## Testing

1. **Unit Tests**
```typescript
describe("function calling", () => {
  it("validates parameters correctly", () => {
    const declaration = {
      name: "test_tool",
      parameters: {
        required: ["param1"],
        properties: {
          param1: { type: "string" }
        }
      }
    }
    
    expect(() => validateParams({}, declaration))
      .toThrow("Missing required parameter")
      
    expect(() => validateParams({ param1: 123 }, declaration))
      .toThrow("Invalid type")
  })
})
```

2. **Integration Tests**
```typescript
describe("gemini integration", () => {
  it("handles function calls", async () => {
    const response = await geminiApi.createChatCompletion({
      messages: [{
        role: "user",
        content: "Show README.md"
      }],
      tools: [githubTools.viewFile]
    })
    
    expect(response.function_call).toBeDefined()
    expect(response.function_call.name).toBe("view_file")
  })
})
```

## Resources

- [Gemini Function Calling Documentation](https://ai.google.dev/docs/function_calling)
- [OpenAPI Schema Specification](https://spec.openapis.org/oas/v3.0.3#schema)
- [JSON Schema](https://json-schema.org/understanding-json-schema/)