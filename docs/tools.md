# Tools System Documentation

This document describes the tools system in Onyx, including the architecture, available tools, and how to add new tools.

## Architecture

The tools system consists of three main components:

1. Tool Store (State Management)
2. Tool Definitions (Implementation)
3. LLM Integration (Execution)

### Tool Store

Located in `app/models/tools/`, the tool store manages tool state and execution:

```typescript
interface Tool {
  id: string
  name: string
  description: string
  parameters: Record<string, unknown>
  enabled: boolean
  lastUsed?: number
  metadata: any
}
```

Key features:
- Enable/disable tools
- Track tool usage
- Store tool metadata
- Handle errors
- Cache results

### Tool Definitions

Tools are defined with standardized interfaces in `app/services/gemini/tools/`:

```typescript
interface ToolDefinition {
  name: string
  description: string
  parameters: Record<string, ToolParameter>
  execute: (params: Record<string, unknown>) => Promise<unknown>
}

interface ToolParameter {
  type: string
  description: string
  enum?: string[]
  required?: boolean
}
```

### LLM Integration

Tools are integrated with LLMs (like Gemini) through:
- Tool registration
- Parameter validation
- Result processing
- Error handling

## Available Tools

### GitHub Tools

#### 1. View File (`view_file`)
Views contents of a file in a GitHub repository.

Parameters:
- `path` (string): File path
- `owner` (string): Repository owner
- `repo` (string): Repository name
- `branch` (string): Branch name

Example:
```typescript
const result = await toolStore.executeTool("github_view_file", {
  path: "README.md",
  owner: "OpenAgentsInc",
  repo: "onyx",
  branch: "main"
})
```

Response:
```typescript
interface FileToolResult {
  content: string
  path: string
  sha?: string
  size?: number
  encoding?: string
}
```

#### 2. View Hierarchy (`view_hierarchy`)
Views the file/folder structure at a path.

Parameters:
- `path` (string): Directory path
- `owner` (string): Repository owner
- `repo` (string): Repository name
- `branch` (string): Branch name

Example:
```typescript
const result = await toolStore.executeTool("github_view_hierarchy", {
  path: "src",
  owner: "OpenAgentsInc",
  repo: "onyx",
  branch: "main"
})
```

Response:
```typescript
interface HierarchyToolResult {
  path: string
  type: "file" | "dir"
  name: string
  children?: HierarchyToolResult[]
}
```

## Adding New Tools

### 1. Define Tool Types

Create types in `app/services/gemini/tools/types.ts`:

```typescript
interface NewToolParams {
  param1: string
  param2: number
}

interface NewToolResult {
  data: any
  metadata?: Record<string, unknown>
}
```

### 2. Implement Tool

Create tool implementation:

```typescript
const newTool: Tool = {
  name: "new_tool",
  description: "Does something useful",
  parameters: {
    param1: {
      type: "string",
      description: "First parameter"
    },
    param2: {
      type: "number",
      description: "Second parameter"
    }
  },
  execute: async (params) => {
    // Implementation
  }
}
```

### 3. Register Tool

Add to tool store initialization:

```typescript
toolStore.addTool({
  id: "new_tool",
  name: "new_tool",
  description: "Does something useful",
  parameters: {...},
  metadata: {
    category: "my_category",
    implementation: async (params) => {
      // Implementation
    }
  }
})
```

### 4. Add Tests

Create tests in `__tests__/tools/`:

```typescript
describe("new_tool", () => {
  it("executes successfully", async () => {
    const result = await toolStore.executeTool("new_tool", {
      param1: "test",
      param2: 123
    })
    expect(result).toBeDefined()
  })
})
```

## Tool Categories

Tools are organized into categories:

1. GitHub
- Repository operations
- File operations
- Code analysis

2. Development (Planned)
- Code generation
- Testing
- Documentation

3. External Services (Planned)
- API integration
- Data fetching
- Authentication

## Best Practices

1. Tool Design
- Clear descriptions
- Validated parameters
- Consistent error handling
- Comprehensive documentation

2. Security
- Parameter validation
- Permission checking
- Rate limiting
- Audit logging

3. Performance
- Result caching
- Batch operations
- Async processing
- Resource cleanup

## Error Handling

Tools should return standardized errors:

```typescript
interface ToolError {
  code: string
  message: string
  details?: unknown
}

// Example
throw {
  code: "INVALID_PARAMS",
  message: "Invalid parameters provided",
  details: { param: "path", error: "Path cannot be empty" }
}
```

Common error codes:
- `INVALID_PARAMS`: Invalid parameters
- `NOT_FOUND`: Resource not found
- `PERMISSION_DENIED`: Insufficient permissions
- `RATE_LIMITED`: Rate limit exceeded
- `INTERNAL_ERROR`: Internal tool error

## Testing Tools

1. Unit Tests
- Parameter validation
- Error handling
- Result formatting

2. Integration Tests
- Tool execution
- Store integration
- LLM integration

3. End-to-end Tests
- Complete workflows
- UI integration
- Error recovery

## Future Enhancements

1. Tool Discovery
- Dynamic tool loading
- Tool marketplace
- Version management

2. Advanced Features
- Tool composition
- Workflow automation
- Custom tool creation

3. UI Integration
- Tool configuration UI
- Usage analytics
- Debug console

## Resources

- [Gemini API Documentation](https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/gemini)
- [GitHub API Documentation](https://docs.github.com/en/rest)
- [MST Documentation](https://mobx-state-tree.js.org/)