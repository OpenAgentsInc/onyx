# Chat System Documentation

The Onyx chat system provides a voice-first chat interface that overlays the main 3D canvas. This document outlines the architecture and usage of the chat system.

## Architecture

The chat system consists of four main parts:

1. **ChatOverlay** - React component for displaying messages
2. **RecordingStore** - MobX State Tree model for managing recording and transcription state
3. **useAudioRecorder** - React hook for audio recording logic
4. **useChat** - AI SDK hook for chat functionality

### Component Structure

```
OnyxScreen
├── Canvas (3D view)
├── ChatOverlay (message display)
└── HudButtons (recording controls)
```

## Components

### ChatOverlay

Located in `app/components/ChatOverlay.tsx`, this component manages the chat interface:

```typescript
interface ChatOverlayProps {
  visible?: boolean
}
```

Features:
- Semi-transparent black background
- White text for contrast
- Messages aligned to bottom
- Automatic transcription display
- Scrollable message list
- No text input (voice only)

### Recording Integration

The chat system integrates with the recording system through the RecordingStore:

1. User presses mic button
2. Audio recording starts
3. User releases mic button
4. Recording is transcribed
5. Transcription appears in chat
6. AI response is generated

## State Management

### RecordingStore

Located in `app/models/RecordingStore.ts`, manages:
- Recording state
- Transcription state
- Recording URIs
- Transcription visibility

```typescript
interface RecordingStore {
  isRecording: boolean
  recordingUri: string | null
  transcription: string | null
  isTranscribing: boolean
  showTranscription: boolean
}
```

### Chat State

Managed by useChat hook from AI SDK:
```typescript
const {
  messages,
  error,
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

2. **Stop & Transcribe**
   ```typescript
   if (isRecording) {
     await recordingStore.transcribeRecording()
   }
   ```

3. **Display in Chat**
   - Transcription appears as user message
   - AI response is generated
   - Both display in chat overlay

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

## Future Improvements

1. Add message persistence
2. Implement chat history
3. Add visual feedback during transcription
4. Support for different chat modes
5. Add message animations
6. Support for rich content in messages
7. Add error recovery for failed transcriptions
8. Implement message retry functionality

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

## Related Components

- `app/components/HudButtons.tsx` - Recording controls
- `app/hooks/useAudioRecorder.ts` - Recording logic
- `app/services/transcriptionService.ts` - Transcription handling