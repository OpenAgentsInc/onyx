# Chat System Documentation

The Onyx chat system provides a voice-first chat interface that overlays the main 3D canvas. This document outlines the architecture and usage of the chat system.

## Architecture

The chat system consists of five main parts:

1. **ChatStore** - MobX State Tree model for message state
2. **useSharedChat** - Hook that bridges Vercel AI SDK with MobX
3. **ChatOverlay** - React component for displaying messages
4. **MessageMenu** - Modal menu for message actions
5. **useAudioRecorder** - Hook for voice input and transcription

### Component Structure

```
OnyxScreen
├── Canvas (3D view)
├── ChatOverlay (message display)
│   └── MessageMenu (message actions)
└── HudButtons (recording controls)
```

## State Management

### ChatStore

Located in `app/models/RootStore.ts`, manages chat state:

```typescript
const ChatStoreModel = types
  .model("ChatStore")
  .props({
    messages: types.array(MessageModel),
  })
  .actions((store) => ({
    setMessages(messages: any[]),
    addMessage(message: any),
    clearMessages(),
  }))
```

### useSharedChat Hook

Located in `app/hooks/useSharedChat.ts`, bridges Vercel AI SDK with MobX:

```typescript
export function useSharedChat() {
  const { chatStore } = useStores()
  const vercelChat = useVercelChat({...})

  // Sync Vercel messages to MobX store
  useEffect(() => {
    if (vercelMessages) {
      runInAction(() => {
        chatStore.setMessages(vercelMessages)
      })
    }
  }, [vercelMessages])

  return {
    messages: chatStore.messages,
    error,
    append,
    // ...other methods
  }
}
```

## Message Flow

1. **Voice Input**
   - User starts recording via mic button
   - Audio is recorded using expo-av
   - Recording is stopped on second press

2. **Transcription & Chat**
   - Recording is automatically transcribed
   - Transcription is sent to chat via append
   - Message appears in chat overlay
   - AI responds through Vercel SDK
   - Response appears in chat overlay

3. **Message Management**
   - Long press to open action menu
   - Copy message content
   - Delete message (UI only)
   - Messages scroll automatically

## UI Components

### ChatOverlay

Main chat interface component:
- Semi-transparent black background
- Messages aligned to bottom
- Scrollable message list
- Long-press message actions
- MobX integration via observer

### MessageMenu

Message action modal:
- Copy message action
- Delete message action
- Semi-transparent backdrop
- Touch outside to dismiss

## Styling

The chat interface uses a futuristic HUD style:

```typescript
const styles = {
  overlay: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1000,
  },
  messageContainer: {
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 8,
    padding: 12,
  },
}
```

## Dependencies

- mobx-state-tree: State management
- @ai-sdk/react: Chat functionality
- expo-av: Audio recording
- expo-clipboard: Message copying

## Recent Changes

1. **State Management**
   - Moved to MobX for centralized state
   - Added ChatStore model
   - Integrated with Vercel AI SDK

2. **Message Flow**
   - Automated transcription and chat flow
   - Removed manual transcription modal
   - Added copy functionality

3. **UI Improvements**
   - Enhanced message visibility
   - Added message containers
   - Improved scroll behavior

## Best Practices

1. Use MobX for state management
2. Handle errors gracefully
3. Provide visual feedback
4. Clean up resources
5. Use proper typing
6. Follow HUD styling
7. Keep components focused