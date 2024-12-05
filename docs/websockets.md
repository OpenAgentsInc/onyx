# WebSocket Implementation Guide

## Overview

The WebSocket implementation provides real-time communication between the React Native client and the Rust server. It handles authentication, message passing, and state management with automatic reconnection and error handling.

## Server Details

- **URL**: `ws://localhost:8000`
- **Protocol**: WebSocket (ws://)
- **Authentication**: API key via `x-api-key` header
- **Message Format**: JSON

## Message Types

### Base Message Structure
```typescript
interface WebSocketMessage {
  type: string
  id: string
  payload: any
}
```

### Ask Request
```typescript
interface AskRequest {
  query: string
  team_id?: string
}

interface AskMessage extends WebSocketMessage {
  type: 'ask'
  payload: AskRequest
}
```

### Response Message
```typescript
interface AskResponse {
  answer: string
  context?: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

interface ResponseMessage extends WebSocketMessage {
  type: 'response'
  payload: AskResponse
}
```

### Authentication Message
```typescript
interface AuthMessage extends WebSocketMessage {
  type: 'auth'
  payload: {
    pubkey: string
    signature: string
    challenge: string
  }
}
```

## WebSocket Service

The `WebSocketService` class handles the core WebSocket functionality:

```typescript
class WebSocketService {
  constructor(config: WebSocketConfig)
  connect(): Promise<void>
  disconnect(): void
  send(message: WebSocketMessage): void
  sendQuery(query: string, teamId?: string): string
  onMessage(type: string, handler: (message: WebSocketMessage) => void): () => void
  onResponse(handler: (message: ResponseMessage) => void): () => void
}
```

### Configuration

```typescript
interface WebSocketConfig {
  url: string
  apiKey?: string
  reconnectInterval?: number
  maxReconnectAttempts?: number
}
```

### Connection State

```typescript
interface ConnectionState {
  connected: boolean
  connecting: boolean
  error?: string
}
```

## React Hook Usage

The `useWebSocket` hook provides a React interface to the WebSocket functionality:

```typescript
const { state, messages, sendMessage, clearMessages } = useWebSocket({
  url: "ws://localhost:8000",
  apiKey: process.env.NEXUS_API_KEY,
})
```

### Hook Return Values
- `state`: Current connection state
- `messages`: Array of received messages
- `sendMessage`: Function to send a query
- `clearMessages`: Function to clear message history

## Implementation Example

```typescript
import { useWebSocket } from "@/services/websocket/useWebSocket"

function ChatComponent() {
  const { state, messages, sendMessage } = useWebSocket({
    url: "ws://localhost:8000",
    apiKey: process.env.NEXUS_API_KEY,
  })

  const handleSend = (query: string) => {
    if (state.connected) {
      sendMessage(query)
    }
  }

  return (
    <View>
      <Text>Status: {state.connected ? "Connected" : "Disconnected"}</Text>
      {messages.map(message => (
        <Text key={message.id}>{message.payload.answer}</Text>
      ))}
    </View>
  )
}
```

## Error Handling

The implementation includes several error handling mechanisms:

1. **Connection Errors**
   - Automatic reconnection attempts
   - Configurable retry limits
   - Error state tracking

2. **Message Errors**
   - Parse error handling
   - Type validation
   - Send queue management

3. **State Management**
   - Connection state tracking
   - Error state propagation
   - Message delivery confirmation

## Reconnection Logic

The service implements an exponential backoff reconnection strategy:

1. Initial connection attempt
2. On failure, wait `reconnectInterval` ms
3. Retry up to `maxReconnectAttempts` times
4. Track reconnection state
5. Reset counter on successful connection

## Security Considerations

1. **API Key Authentication**
   - Sent via `x-api-key` header
   - Required for all connections
   - Should be stored securely

2. **Message Validation**
   - Type checking for all messages
   - Payload validation
   - Error handling for invalid messages

3. **Connection Security**
   - Use WSS in production
   - Validate server certificates
   - Implement timeout handling

## Best Practices

1. **Connection Management**
   - Initialize connection early
   - Handle disconnects gracefully
   - Clean up on component unmount

2. **Message Handling**
   - Implement message queuing
   - Handle out-of-order messages
   - Validate message types

3. **Error Handling**
   - Log errors appropriately
   - Implement fallback behavior
   - Show user-friendly error messages

4. **State Management**
   - Track connection state
   - Handle reconnection logic
   - Manage message history

## Environment Setup

1. Set the required environment variables:
```bash
NEXUS_API_KEY=your_api_key_here
```

2. Ensure the WebSocket server is running:
```bash
# Server should be running at ws://localhost:8000
```

## Debugging

To enable WebSocket debugging:

1. Add console logging:
```typescript
WebSocket.onmessage = (event) => {
  console.log('Received:', event.data)
}
```

2. Monitor connection state:
```typescript
useEffect(() => {
  console.log('WebSocket state:', state)
}, [state])
```

3. Check network traffic in React Native Debugger

## Common Issues

1. **Connection Failures**
   - Check API key is set
   - Verify server is running
   - Check network connectivity

2. **Message Errors**
   - Validate message format
   - Check payload types
   - Verify message handlers

3. **State Issues**
   - Monitor connection state
   - Check reconnection logic
   - Verify error handling

## Future Improvements

1. **Features**
   - Message persistence
   - Offline support
   - Message encryption

2. **Performance**
   - Message batching
   - Connection pooling
   - State optimization

3. **Security**
   - Token refresh
   - Message signing
   - Rate limiting