# Chat System Documentation

The Onyx chat system provides a voice-first chat interface that overlays the main 3D canvas. This document outlines the architecture and usage of the chat system.

## Architecture

The chat system consists of five main parts:

1. **ChatOverlay** - React component for displaying messages
2. **MessageMenu** - Modal menu for message actions
3. **RecordingStore** - MobX State Tree model for managing recording and transcription state
4. **useAudioRecorder** - React hook for audio recording and transcription logic
5. **useChat** - AI SDK hook for chat functionality

### Component Structure

```
OnyxScreen
├── Canvas (3D view)
├── ChatOverlay (message display)
│   └── MessageMenu (message actions)
└── HudButtons (recording controls)
```

## Components

### ChatOverlay

Located in `app/components/ChatOverlay.tsx`, this component manages the chat interface:

```typescript
interface ChatOverlayProps {
  visible?: boolean
}

interface Message {
  id: string
  role: string
  content: string
}
```

Features:
- Semi-transparent black background
- White text for contrast
- Messages aligned to bottom
- Automatic transcription display
- Scrollable message list
- No text input (voice only)
- Long-press message actions

### MessageMenu

Located in `app/components/MessageMenu.tsx`, provides message action options:

```typescript
interface MessageMenuProps {
  visible: boolean
  onClose: () => void
  onDelete: () => void
  messageContent: string
}
```

Features:
- Modal presentation
- Copy message action
- Delete message action
- Semi-transparent backdrop
- Futuristic styling
- Touch outside to dismiss

### Message Actions

Messages can be managed through long-press interactions:

1. **Long Press**
   - Hold message for 500ms to trigger menu
   - Works on both AI responses and transcriptions

2. **Copy Message**
   ```typescript
   const handleCopy = async () => {
     await Clipboard.setStringAsync(messageContent)
   }
   ```

3. **Delete Message**
   ```typescript
   const handleDeleteMessage = () => {
     const newMessages = messages.filter(m => m.id !== selectedMessage.id)
     setMessages(newMessages)
   }
   ```

## State Management

### RecordingStore

Located in `app/models/RecordingStore.ts`, manages:
- Recording state
- Transcription state
- Recording URIs

```typescript
interface RecordingStore {
  isRecording: boolean
  recordingUri: string | null
  transcription: string | null
  isTranscribing: boolean
}
```

### Chat State

Managed by useChat hook from AI SDK:
```typescript
const {
  messages,
  error,
  setMessages
} = useChat({
  api: 'https://pro.openagents.com/api/chat-app'
})
```

## Usage Flow

1. **Start Recording**
   ```typescript
   const handleMicPress = async () => {
     await toggleRecording()
   }
   ```

2. **Stop & Auto-Process**
   - Recording stops
   - Automatic transcription
   - Automatic chat submission
   - AI response generation

3. **Message Management**
   - Long press to open action menu
   - Copy or delete message
   - Message updates in real-time

## Styling

The chat overlay uses a futuristic HUD style:

```typescript
const styles = {
  overlay: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 16,
  },
  messageText: {
    color: "#fff",
  },
  roleText: {
    color: "#fff",
    fontWeight: "700",
  }
}
```

## Dependencies

- expo-av: Audio recording
- mobx-state-tree: State management
- @ai-sdk/react: Chat functionality
- expo/fetch: Network requests
- expo-clipboard: Message copying

## Future Improvements

1. Add message persistence
2. Implement chat history
3. Add visual feedback during transcription
4. Support for different chat modes
5. Add message animations
6. Support for rich content in messages
7. Add error recovery for failed transcriptions
8. Implement message retry functionality
9. Add more message actions
10. Add message editing capability
11. Implement message reactions
12. Add message threading support

## Error Handling

The system handles several types of errors:

1. Recording errors
   - Permission denied
   - Hardware issues
   - Storage full

2. Transcription errors
   - Network issues
   - Service unavailable
   - Invalid audio format

3. Chat errors
   - API connection issues
   - Rate limiting
   - Invalid responses

## Best Practices

1. Always check recording permissions before starting
2. Handle network errors gracefully
3. Provide visual feedback during recording
4. Clean up resources when component unmounts
5. Implement retry logic for failed operations
6. Cache messages for offline access
7. Handle long transcriptions appropriately
8. Confirm destructive actions (e.g., message deletion)

## Related Components

- `app/components/HudButtons.tsx` - Recording controls
- `app/components/MessageMenu.tsx` - Message actions menu
- `app/hooks/useAudioRecorder.ts` - Recording logic
- `app/services/transcriptionService.ts` - Transcription handling