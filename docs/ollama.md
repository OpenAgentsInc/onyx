# Ollama Integration

This document describes the implementation of Ollama chat integration in the Onyx app.

## Overview

The Ollama integration allows users to chat with locally running LLMs through the Pylon WebSocket connection. The implementation follows a similar pattern to the file explorer, using the MCP (Model Context Protocol) for communication.

## Architecture

### Components

1. **Types (`app/types/ollama.ts`)**
   - `ChatMessage`: Represents a single message in the chat
   - `ChatRequest`: The request format for sending messages to Ollama
   - `ChatResponse`: The response format from Ollama
   - `OllamaCapability`: Defines Ollama-specific capabilities

2. **Hook (`app/services/ollama/useOllamaChat.ts`)**
   - Custom hook that manages the chat state and WebSocket communication
   - Handles message sending and receiving
   - Manages loading and error states
   - Provides message history

3. **UI Components**
   - `ChatMessage.tsx`: Renders individual chat messages
   - `InboxScreen.tsx`: Main chat interface with input and message list

### WebSocket Communication

The integration uses the existing WebSocket infrastructure with a new method for Ollama:

```typescript
// JSON-RPC request format
{
  jsonrpc: '2.0',
  method: 'ollama/chat',
  params: {
    model: string,
    messages: ChatMessage[]
  },
  id: string
}

// JSON-RPC response format
{
  jsonrpc: '2.0',
  result: {
    message: ChatMessage
  },
  id: string
}
```

## Usage

### Basic Chat

```typescript
const {
  messages,
  isLoading,
  error,
  sendMessage,
  clearMessages,
  connected
} = useOllamaChat('llama3.2');

// Send a message
await sendMessage('Hello, how are you?');
```

### Message Format

Messages follow this structure:
```typescript
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}
```

## Implementation Details

### Connection Flow

1. The WebSocket connection is established through Pylon
2. The client checks for Ollama capability in server response
3. Chat can begin once connection is established

### Message Flow

1. User sends message
2. Message is added to local state
3. Request is sent to Pylon via WebSocket
4. Response is received and added to message list
5. UI updates to show new message

### Error Handling

- Connection errors are displayed in the UI
- Message send failures are caught and displayed
- Loading states are managed for better UX

## Styling

The chat interface follows the app's dark theme:
- Dark background (#1a1a1a)
- Light text for readability
- Blue accent for user messages (#0084ff)
- Gray for assistant messages (#333)
- Loading and error states with appropriate colors

## Future Improvements

1. **Streaming Support**
   - Implement streaming responses
   - Show typing indicators
   - Allow message cancellation

2. **Model Selection**
   - Add model switching capability
   - Show available models
   - Remember user preferences

3. **Advanced Features**
   - Message persistence
   - Conversation management
   - System prompt configuration
   - Temperature and other parameter controls
