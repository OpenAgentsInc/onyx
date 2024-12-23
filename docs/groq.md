# Groq API Integration

This document describes the Groq API integration in Onyx, including the current implementation and guidelines for future expansions.

## Overview

The Groq integration provides high-performance language model capabilities through Groq's cloud API. The integration is designed to be modular and extensible, currently supporting chat completions with potential for expansion to other Groq services.

## Configuration

### Environment Variables

```bash
GROQ_API_KEY=your_api_key_here
```

The API key can be obtained from the [Groq Console](https://console.groq.com/keys).

### Default Configuration

```typescript
const DEFAULT_CONFIG: GroqConfig = {
  apiKey: Config.GROQ_API_KEY ?? "",
  baseURL: "https://api.groq.com/v1",
  timeout: 30000,
}
```

## Current Implementation

### File Structure

```
app/services/groq/
├── groq-api.types.ts  - Type definitions
├── groq-chat.ts      - Main API implementation
└── index.ts          - Exports
```

### Core Components

1. **Type Definitions** (`groq-api.types.ts`):
   - `GroqConfig` - API configuration interface
   - `ChatMessage` - Message format for chat completions
   - `ChatCompletionResponse` - Response format from chat endpoints

2. **API Implementation** (`groq-chat.ts`):
   - `GroqChatApi` class handling API interactions
   - Error handling and response processing
   - Message format conversion

3. **Store Integration** (`app/models/chat/`):
   - `ChatStore` with Groq actions
   - Message state management
   - Error handling and loading states

### Usage in Components

#### Text Input
```typescript
const { chatStore } = useStores()
await chatStore.sendMessage(messageText)
```

#### Voice Input
```typescript
const { chatStore } = useStores()
await chatStore.sendMessage(transcribedText)
```

## Available Endpoints

### Currently Implemented

#### Chat Completions
- Endpoint: `/chat/completions`
- Models: 
  - `llama3-70b-8192` (default)
  - Other Groq models as they become available
- Parameters:
  ```typescript
  {
    temperature?: number      // Default: 0.7
    max_tokens?: number      // Default: 1024
    top_p?: number          // Default: 1
    stop?: string | string[]
    response_format?: { type: "json_object" }
  }
  ```

### Future Expansion Opportunities

#### Speech-to-Text
Groq's speech-to-text API could be integrated to replace or supplement the current local voice transcription:

```typescript
interface SpeechToTextConfig {
  model: string
  audio: ArrayBuffer
  language?: string
  task?: "transcribe" | "translate"
}

// Potential implementation
class GroqSpeechApi {
  async transcribe(audio: ArrayBuffer, config?: Partial<SpeechToTextConfig>) {
    // Implementation
  }
}
```

#### Text-to-Speech
If Groq adds text-to-speech capabilities:

```typescript
interface TextToSpeechConfig {
  model: string
  text: string
  voice?: string
  speed?: number
}

// Potential implementation
class GroqSpeechApi {
  async synthesize(text: string, config?: Partial<TextToSpeechConfig>) {
    // Implementation
  }
}
```

## Error Handling

The integration includes comprehensive error handling:

1. **API Level**:
   - Network errors
   - Authentication errors
   - Rate limiting
   - Invalid responses

2. **Store Level**:
   - Message state management
   - Error state propagation
   - Loading states

3. **UI Level**:
   - Error messages
   - Loading indicators
   - Retry mechanisms

## Best Practices

1. **API Calls**:
   - Always use the store actions rather than calling the API directly
   - Handle errors at the appropriate level
   - Use proper typing for all API interactions

2. **Configuration**:
   - Keep API keys secure
   - Use environment variables for configuration
   - Set appropriate timeouts

3. **Error Handling**:
   - Log errors appropriately
   - Provide user-friendly error messages
   - Include retry mechanisms where appropriate

## Adding New Endpoints

To add support for new Groq endpoints:

1. Add appropriate types to `groq-api.types.ts`
2. Create a new service class or extend existing ones
3. Add store actions if needed
4. Update documentation

Example:
```typescript
// 1. Add types
interface NewEndpointConfig {
  // ...
}

// 2. Create service
class GroqNewFeatureApi {
  // ...
}

// 3. Add store actions
const withNewFeatureActions = (self: Instance<any>) => ({
  newFeatureAction: flow(function* () {
    // ...
  })
})
```

## Testing

When implementing new features:

1. Add unit tests for API interactions
2. Add integration tests for store actions
3. Test error handling
4. Test edge cases and rate limiting

## Resources

- [Groq API Documentation](https://console.groq.com/docs/api-reference)
- [Groq Models](https://console.groq.com/docs/models)
- [Rate Limits](https://console.groq.com/docs/rate-limits)