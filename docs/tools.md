# Tools System Documentation

This document describes the tools system in Onyx, including the architecture, available tools, and how tools are managed between client and server.

## Architecture

The tools system consists of three main components:

1. Server-side Tool Definitions (Nexus)
2. Client-side Tool Management (Onyx)
3. LLM Integration (Gemini)

### Server-side Tool Definitions

Located in `nexus/src/tools/`, the server manages tool implementations:

```typescript
// Example from src/tools.ts
export const allTools = {
  view_file: { tool: viewFileTool, description: "View file contents at path" },
  view_folder: { tool: viewFolderTool, description: "View folder contents at path" },
  create_file: { tool: createFileTool, description: "Create a new file at path with content" },
  rewrite_file: { tool: rewriteFileTool, description: "Rewrite file at path with new content" },
}
```

Key features:
- Centralized tool definitions
- Standardized implementations
- Consistent error handling
- Server-side execution

### Client-side Tool Management

The client manages tool enablement through the ChatStore:

```typescript
// From app/models/chat/ChatStore.ts
export const ChatStoreModel = types
  .model("ChatStore")
  .props({
    enabledTools: types.optional(types.array(types.string), [
      "view_file",
      "view_folder",
      "create_file",
      "rewrite_file"
    ]),
  })
  .actions(self => ({
    toggleTool(toolName: string) {
      const index = self.enabledTools.indexOf(toolName)
      if (index === -1) {
        self.enabledTools.push(toolName)
      } else {
        self.enabledTools.splice(index, 1)
      }
    },
    setEnabledTools(tools: string[]) {
      self.enabledTools.replace(tools)
    }
  }))
  .views(self => ({
    isToolEnabled(toolName: string) {
      return self.enabledTools.includes(toolName)
    }
  }))
```

### LLM Integration

Tools are integrated with Gemini through the Nexus server:
- Tool availability based on client selection
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

#### 2. View Folder (`view_folder`)
Views the file/folder structure at a path.

Parameters:
- `path` (string): Directory path
- `owner` (string): Repository owner
- `repo` (string): Repository name
- `branch` (string): Branch name

#### 3. Create File (`create_file`)
Creates a new file with specified content.

Parameters:
- `path` (string): File path
- `content` (string): File content
- `owner` (string): Repository owner
- `repo` (string): Repository name
- `branch` (string): Branch name

#### 4. Rewrite File (`rewrite_file`)
Rewrites an existing file with new content.

Parameters:
- `path` (string): File path
- `content` (string): New file content
- `owner` (string): Repository owner
- `repo` (string): Repository name
- `branch` (string): Branch name

## Tool Management UI

Tools are managed through the RepoSection component:

```typescript
// From app/onyx/RepoSection.tsx
const AVAILABLE_TOOLS = [
  { id: "view_file", name: "View File", description: "View file contents at path" },
  { id: "view_folder", name: "View Folder", description: "View file/folder hierarchy at path" },
  { id: "create_file", name: "Create File", description: "Create a new file at path with content" },
  { id: "rewrite_file", name: "Rewrite File", description: "Rewrite file at path with new content" },
]
```

Features:
- Individual tool enablement
- Tool descriptions
- Persistent tool state
- Visual feedback
- Mobile-friendly interface

## Request Flow

1. Client sends request with:
   - Message content
   - GitHub token
   - Enabled tools list
   - Active repositories

2. Server processes request:
   - Validates GitHub token
   - Filters available tools based on enabled list
   - Provides tools to Gemini
   - Executes tool calls
   - Returns results

3. Client displays results:
   - Tool invocation status
   - Execution results
   - Error messages if any

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
- Efficient tool execution
- Result caching
- Resource cleanup

## Error Handling

Tools return standardized errors:

```typescript
interface ToolError {
  success: false
  error: string
  details?: unknown
}

// Example
return {
  success: false,
  error: "Invalid parameters provided",
  details: { param: "path", error: "Path cannot be empty" }
}
```

Common error codes:
- `INVALID_PARAMS`: Invalid parameters
- `NOT_FOUND`: Resource not found
- `PERMISSION_DENIED`: Insufficient permissions
- `RATE_LIMITED`: Rate limit exceeded
- `INTERNAL_ERROR`: Internal tool error

## Future Improvements

1. Tool Discovery
- Dynamic tool loading
- Tool categories
- Version management

2. Advanced Features
- Tool composition
- Workflow automation
- Custom tool creation

3. UI Enhancements
- Tool usage analytics
- Performance metrics
- Debug console

## Resources

- [Gemini API Documentation](https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/gemini)
- [GitHub API Documentation](https://docs.github.com/en/rest)
- [MST Documentation](https://mobx-state-tree.js.org/)