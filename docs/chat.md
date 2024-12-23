# Chat System Documentation

The chat system in Onyx is built using MobX-State-Tree (MST) for state management and provides voice input capabilities. This document explains the architecture and usage of the chat system.

## Architecture

### Store Structure

The chat system is organized into several modular components:

```
src/models/chat/
├── actions/
│   ├── initialize.ts         # Setup and reset actions
│   ├── context-management.ts # Context lifecycle management
│   ├── message-management.ts # Message CRUD operations
├── types.ts                  # Core type definitions
├── views.ts                  # Computed properties
├── store.ts                  # Main store definition
└── index.ts                  # Central exports
```

### Core Models

#### Message Model
```typescript
MessageModel = {
  id: string
  text: string
  timestamp: number
  role: "user" | "assistant" | "system"
  metadata: {
    contextId?: string
    conversationId?: string
    timings?: string
    system?: boolean
    copyable?: boolean
  }
}
```

#### Chat Context Model
```typescript
ChatContextModel = {
  id: string
  modelKey: string
  isLoaded: boolean
  gpu: boolean
  reasonNoGPU: string
  sessionPath?: string
}
```

## Voice Chat Integration

The voice chat functionality is implemented in:

```
src/onyx/
├── hooks/
│   ├── useChatStore.ts    # Chat store access and message handling
│   └── useVoiceChat.ts    # Voice modal state management
├── VoiceChat.tsx          # Main wrapper component
├── VoiceInputModal.tsx    # Voice input UI
└── constants.ts           # Chat-related constants
```

### Usage

1. Wrap your component with VoiceChat:
```tsx
import { VoiceChat } from "@/onyx/VoiceChat"

export const YourComponent = () => {
  return (
    <VoiceChat>
      {({ showVoiceModal, isInferencing }) => (
        <Button 
          onPress={showVoiceModal}
          disabled={isInferencing}
          title="Voice Input"
        />
      )}
    </VoiceChat>
  )
}
```

2. Access chat store functionality:
```tsx
import { useChatStore } from "@/onyx/hooks/useChatStore"

const MyComponent = () => {
  const { sendMessage, isInferencing, error } = useChatStore()
  
  const handleSend = async (text: string) => {
    await sendMessage(text)
  }
}
```

## Chat Store Features

### Message Management
- Add messages with metadata
- Update message content
- Remove messages
- Clear conversation history

### Context Management
- Set active model
- Add/remove chat contexts
- Manage context loading state
- Handle session persistence

### Views (Computed Properties)
- Active context
- Sorted conversation messages
- Context loading status
- GPU availability

## Constants

Default parameters and stop sequences are defined in `constants.ts`:

```typescript
CHAT_CONSTANTS = {
  DEFAULT_SYSTEM_MESSAGE: string
  DEFAULT_TEMPERATURE: number
  DEFAULT_TOP_K: number
  DEFAULT_TOP_P: number
  DEFAULT_MIN_P: number
  MAX_TOKENS: number
  STOP_SEQUENCES: string[]
}
```

## Voice Input Flow

1. User opens voice modal
2. System requests microphone permissions
3. Voice input is transcribed in real-time
4. User can send transcribed text
5. Text is processed through chat store
6. Response is generated and displayed

## Error Handling

The system includes error handling for:
- Microphone permissions
- Voice transcription
- Message sending
- Context management
- Model inference

## State Management

The chat store manages:
- Message history
- Active contexts
- Inference state
- Error states
- Loading states

## Future Improvements

1. Implement actual inference logic
2. Add streaming responses
3. Add message persistence
4. Add conversation management
5. Enhance error handling
6. Add retry mechanisms
7. Add message queue
8. Add offline support

## Related Documentation

- [Model Management](./models.md)
- [Voice Recognition](./voice.md)
- [Error Handling](./errors.md)