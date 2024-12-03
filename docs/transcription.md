# Transcription System Documentation

The Onyx transcription system provides speech-to-text capabilities for recorded audio. It integrates with the recording system and chat system for a seamless voice-to-text-to-chat experience.

## Architecture

The transcription system consists of three main parts:

1. **TranscriptionService** - API integration for audio transcription
2. **RecordingStore** - State management for transcription
3. **useAudioRecorder** - Hook that manages transcription flow

### TranscriptionService (app/services/transcriptionService.ts)

Handles the API communication for transcription:

```typescript
export async function transcribeAudio(uri: string): Promise<string> {
  // Creates FormData with audio file
  // Sends to transcription API
  // Returns transcribed text
}
```

Features:
- Audio file upload handling
- Error management
- Type-safe implementation
- Comprehensive error logging

### RecordingStore (app/models/RecordingStore.ts)

Manages transcription state using MobX State Tree:

```typescript
export const RecordingStoreModel = types
  .model("RecordingStore")
  .props({
    isRecording: false,
    recordingUri: types.maybeNull(types.string),
    transcription: types.maybeNull(types.string),
    isTranscribing: false,
  })
```

Properties:
- `transcription`: The transcribed text
- `isTranscribing`: Loading state flag

Actions:
- `transcribeRecording()`: Initiates transcription
- `setTranscription()`: Updates transcription text
- `setIsTranscribing()`: Updates loading state

## Usage Flow

1. **Record Audio**
   - Press mic button to start recording
   - Press again to stop recording
   - Recording is saved locally

2. **Automatic Transcription**
   - Transcription starts automatically after recording stops
   - Loading state is shown during transcription
   - Transcribed text is stored in state

3. **Chat Integration**
   - Transcribed text is automatically sent to chat
   - Appears as user message
   - Triggers AI response

4. **Error Handling**
   - User-friendly error messages
   - Automatic state recovery
   - Detailed error logging

## API Integration

The system uses a dedicated endpoint for transcription:

```typescript
export const API_URLS = {
  transcribe: "https://api.openagents.com/v1/transcribe",
}
```

Request format:
- Method: POST
- Body: FormData with audio file
- Response: JSON with transcribed text

## Error Handling

The system handles various error cases:

1. **API Errors**
   - Network issues
   - Server errors
   - Invalid responses

2. **File Errors**
   - Invalid audio format
   - File access issues
   - Upload failures

3. **UI Errors**
   - State management issues
   - Loading state handling
   - Error recovery

All errors are:
- Logged for debugging
- Handled gracefully
- Reported to user when appropriate

## Future Improvements

Potential enhancements:

1. **Functionality**
   - Real-time transcription
   - Multiple language support
   - Transcription history
   - Export options

2. **Performance**
   - Caching
   - Offline support
   - Batch processing
   - Compression options

## Dependencies

- mobx-state-tree: State management
- expo-av: Audio handling
- react-native: UI components
- typescript: Type safety