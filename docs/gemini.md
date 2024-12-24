# Gemini Integration with Tool Use

This document describes the Gemini API integration in Onyx, with a focus on tool use capabilities and implementation plan.

## Overview

The Gemini integration provides advanced language model capabilities with tool use through Google's Vertex AI. The integration is designed to be modular and extensible, supporting various tools that enhance the model's capabilities.

## Configuration

### Environment Variables

```bash
GOOGLE_CLOUD_PROJECT=your_project_id
GOOGLE_CLOUD_REGION=your_region # defaults to us-central1
```

### Default Configuration

```typescript
const DEFAULT_CONFIG: GeminiConfig = {
  project: Config.GOOGLE_CLOUD_PROJECT ?? "",
  location: Config.GOOGLE_CLOUD_REGION ?? "us-central1",
  model: "gemini-2.0-flash-exp",
}
```

## Implementation Plan

### Phase 1: Basic Tool Integration

#### File Structure

```
app/services/gemini/
├── gemini-api.types.ts   - Type definitions
├── gemini-chat.ts        - Main API implementation
├── tools/                - Tool implementations
│   ├── github.ts         - GitHub tools
│   ├── index.ts          - Tool exports
│   └── types.ts          - Tool type definitions
└── index.ts             - Exports
```

#### Core Components

1. **Type Definitions** (`gemini-api.types.ts`):
   ```typescript
   interface GeminiConfig {
     project: string
     location?: string
     model?: string
   }

   interface Tool {
     name: string
     description: string
     parameters: Record<string, unknown>
     execute: (params: Record<string, unknown>) => Promise<unknown>
   }

   interface ChatMessage {
     role: "user" | "assistant" | "system"
     content: string
     tools?: Tool[]
   }
   ```

2. **GitHub Tools** (`tools/github.ts`):
   ```typescript
   export const githubTools = {
     viewFile: {
       name: "view_file",
       description: "View file contents at path",
       parameters: {
         path: "string",
         owner: "string",
         repo: "string",
         branch: "string"
       },
       execute: async (params) => {
         // Implementation
       }
     },
     viewHierarchy: {
       name: "view_hierarchy",
       description: "View file/folder hierarchy at path",
       parameters: {
         path: "string",
         owner: "string",
         repo: "string",
         branch: "string"
       },
       execute: async (params) => {
         // Implementation
       }
     }
   }
   ```

3. **Chat Implementation** (`gemini-chat.ts`):
   ```typescript
   export class GeminiChatApi {
     constructor(config: GeminiConfig)
     
     async createChatCompletion(
       messages: ChatMessage[],
       tools?: Tool[],
       options?: GenerateContentConfig
     ): Promise<ChatCompletionResponse>
     
     private handleToolCalls(
       toolCalls: ToolCall[]
     ): Promise<ToolResponse[]>
   }
   ```

### Phase 2: Advanced Tool Features

1. **Tool Categories**:
   - Repository Management
   - File Operations
   - Code Analysis
   - External Services

2. **Tool Validation**:
   - Parameter type checking
   - Permission validation
   - Rate limiting

3. **Tool Response Handling**:
   - Structured responses
   - Error handling
   - Response formatting

### Phase 3: Future Tools

1. **Code Analysis Tools**:
   - Code review
   - Security scanning
   - Performance analysis
   - Dependency checking

2. **Repository Tools**:
   - Branch management
   - PR workflows
   - Issue management
   - Repository statistics

3. **External Service Tools**:
   - Documentation generation
   - API integration
   - Testing frameworks
   - Deployment tools

## Usage Examples

### Basic Tool Use

```typescript
const geminiApi = new GeminiChatApi(config)

const response = await geminiApi.createChatCompletion({
  messages: [{
    role: "user",
    content: "Show me the contents of README.md"
  }],
  tools: [githubTools.viewFile],
  options: {
    temperature: 0.7
  }
})
```

### Multiple Tools

```typescript
const response = await geminiApi.createChatCompletion({
  messages: [{
    role: "user",
    content: "Analyze the project structure and suggest improvements"
  }],
  tools: [
    githubTools.viewFile,
    githubTools.viewHierarchy,
    codeAnalysisTools.analyzeStructure
  ]
})
```

## Error Handling

1. **Tool-specific Errors**:
   - Invalid parameters
   - Permission denied
   - Resource not found
   - Rate limits exceeded

2. **API Errors**:
   - Authentication failures
   - Network issues
   - Invalid responses
   - Timeout handling

3. **Response Processing**:
   - Validation
   - Formatting
   - Error recovery

## Best Practices

1. **Tool Design**:
   - Clear descriptions
   - Validated parameters
   - Consistent error handling
   - Comprehensive documentation

2. **Security**:
   - Token validation
   - Permission checking
   - Rate limiting
   - Audit logging

3. **Performance**:
   - Caching where appropriate
   - Batch operations
   - Async processing
   - Resource cleanup

## Testing

1. **Unit Tests**:
   - Tool validation
   - Parameter checking
   - Response formatting

2. **Integration Tests**:
   - API communication
   - Tool execution
   - Error scenarios

3. **End-to-end Tests**:
   - Complete workflows
   - Multiple tool interactions
   - Real-world scenarios

## Resources

- [Gemini API Documentation](https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/gemini)
- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Tool Use Guidelines](https://cloud.google.com/vertex-ai/docs/generative-ai/multimodal/function-calling)