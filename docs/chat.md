# Chat System Documentation

## Overview

The Onyx chat system is built using MobX-State-Tree (MST) for state management and provides both text and voice input capabilities. The system is designed to be modular and extensible, with clear separation of concerns.

## Directory Structure

```
src/
├── models/
│   ├── chat/
│   │   ├── actions/
│   │   │   ├── initialize.ts         # Setup and initialization actions
│   │   │   ├── context-management.ts # Context lifecycle management
│   │   │   └── message-management.ts # Message CRUD operations
│   │   ├── types.ts                  # Core type definitions
│   │   ├── views.ts                  # Computed properties
│   │   ├── store.ts                  # Main store definition
│   │   └── index.ts                  # Public exports
│   └── RootStore.ts                  # Root store integration
└── onyx/
    ├── hooks/
    │   ├── useChatStore.ts          # Chat store access hook
    │   ├── useTextChat.ts           # Text input management
    │   ├── useVoiceChat.ts          # Voice input management
    │   └── useInitialContext.ts     # Context initialization
    ├── TextChat.tsx                 # Text chat wrapper component
    ├── VoiceChat.tsx               # Voice chat wrapper component
    ├── TextInputModal.tsx          # Text input UI
    ├── VoiceInputModal.tsx         # Voice input UI
    └── styles.ts                   # Shared styles
```

## Core Models

### Message Model
```typescript
MessageModel = {
  id: string                  // Unique message identifier
  text: string               // Message content
  timestamp: number         // Creation timestamp
  role: "user" | "assistant" | "system"  // Message sender
  metadata: {
    contextId?: string      // Associated context
    conversationId?: string // Conversation grouping
    timings?: string       // Performance metrics
    system?: boolean       // System message flag
    copyable?: boolean     // Copyable content flag
  }
}
```

### Chat Context Model
```typescript
ChatContextModel = {
  id: string                // Unique context identifier
  modelKey: string         // Associated LLM model
  isLoaded: boolean       // Model load status
  gpu: boolean           // GPU availability
  reasonNoGPU: string   // GPU unavailability reason
  sessionPath?: string  // Session storage location
}
```

## Store Architecture

### ChatStore
The central state management store with several components:

1. **Properties**:
```typescript
{
  isInitialized: boolean
  error: string | null
  contexts: ChatContext[]
  messages: Message[]
  activeModelKey: string | null
  inferencing: boolean
}
```

2. **Actions**:
- Basic Actions:
  - setError(error: string | null)
  - setInferencing(value: boolean)
  - setActiveModel(modelKey: string | null)

- Message Actions:
  - addMessage(message: MessageInput)
  - updateMessage(id: string, updates: Partial<Message>)
  - removeMessage(id: string)
  - clearMessages()

- Context Actions:
  - addContext(id: string, modelKey: string)
  - setContextLoaded(id: string, loaded: boolean)
  - removeContext(id: string)
  - setContextSession(id: string, path: string)

3. **Views**:
```typescript
{
  activeContext: ChatContext | null
  conversationMessages: Message[]
  hasActiveContext: boolean
  isContextLoaded: boolean
  gpuAvailable: boolean
}
```

## UI Components

### TextChat Component
Wrapper component providing text input capabilities:
```typescript
<TextChat>
  {({ showTextModal, isInferencing }) => (
    // Your UI components
  )}
</TextChat>
```

### VoiceChat Component
Wrapper component providing voice input capabilities:
```typescript
<VoiceChat>
  {({ showVoiceModal, isInferencing }) => (
    // Your UI components
  )}
</VoiceChat>
```

### Input Modals
1. **TextInputModal**:
   - Handles text input
   - Manages input state
   - Provides send/cancel actions

2. **VoiceInputModal**:
   - Manages voice recording
   - Handles transcription
   - Provides real-time feedback

## Hooks

### useChatStore
Primary hook for accessing chat functionality:
```typescript
const {
  sendMessage,
  isInferencing,
  error,
  conversationMessages
} = useChatStore()
```

### useTextChat
Manages text input state and interactions:
```typescript
const {
  isModalVisible,
  showTextModal,
  hideTextModal,
  handleTextInput,
  isInferencing
} = useTextChat()
```

### useVoiceChat
Manages voice input state and interactions:
```typescript
const {
  isModalVisible,
  showVoiceModal,
  hideVoiceModal,
  handleVoiceInput,
  isInferencing
} = useVoiceChat()
```

### useInitialContext
Handles context initialization:
```typescript
useInitialContext() // Sets up initial chat context
```

## Message Flow

1. **Text Input Flow**:
   - User opens text modal
   - Types message
   - Message is sent to store
   - Store updates state
   - UI reflects changes

2. **Voice Input Flow**:
   - User opens voice modal
   - Speech is transcribed
   - Transcription is sent to store
   - Store updates state
   - UI reflects changes

3. **Message Processing**:
   - Message added to store
   - Inferencing state set
   - Model processes message
   - Response added to store
   - Inferencing state cleared

## State Management

### Store Initialization
```typescript
const store = ChatStoreModel.create({
  isInitialized: false,
  error: null,
  contexts: [],
  messages: [],
  activeModelKey: null,
  inferencing: false,
})
```

### Context Management
```typescript
// Create context
chatStore.addContext("context-id", "model-key")

// Set active model
chatStore.setActiveModel("model-key")

// Update context state
chatStore.setContextLoaded("context-id", true)
```

### Message Management
```typescript
// Send message
chatStore.addMessage({
  text: "Hello",
  role: "user",
  metadata: {
    contextId: "context-id",
    conversationId: "conv-id"
  }
})

// Clear conversation
chatStore.clearMessages()
```

## Error Handling

1. **Store Errors**:
   - Invalid context state
   - Message sending failures
   - Model loading issues

2. **Input Errors**:
   - Voice recognition failures
   - Text input validation
   - Network issues

3. **Context Errors**:
   - Model loading failures
   - GPU availability issues
   - Session management problems

## Performance Considerations

1. **Message Rendering**:
   - Messages are rendered in reverse order
   - Pagination is handled by ScrollView
   - Performance optimizations via memo

2. **State Updates**:
   - Batched updates for better performance
   - Computed properties for derived data
   - Efficient state management via MST

3. **Resource Management**:
   - Voice recognition cleanup
   - Context cleanup on unmount
   - Memory management for large conversations

## Future Improvements

1. **Features**:
   - Message persistence
   - Offline support
   - Multi-model conversations
   - Advanced context management

2. **Performance**:
   - Message virtualization
   - Lazy loading
   - Background processing

3. **UX Improvements**:
   - Message animations
   - Real-time updates
   - Enhanced error feedback
   - Accessibility improvements