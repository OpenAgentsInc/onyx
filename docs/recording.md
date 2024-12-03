# Audio Recording System

The Onyx audio recording system provides voice recording capabilities using Expo's AV API. The system is built with MobX State Tree for state management and follows React Native best practices.

## Architecture

The recording system consists of three main parts:

1. **RecordingStore** - MobX State Tree model for state management
2. **useAudioRecorder** - React hook for audio recording logic
3. **HudButtons** - UI component with recording controls

### RecordingStore (app/models/RecordingStore.ts)

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
- `isRecording`: Boolean flag indicating if recording is in progress
- `recordingUri`: String containing the URI of the last recording (null if none)
- `transcription`: The transcribed text from the last recording
- `isTranscribing`: Flag indicating transcription in progress

Actions:
- `setIsRecording(value: boolean)`: Update recording state
- `setRecordingUri(uri: string | null)`: Set the URI of the recorded audio
- `clearRecording()`: Clear the current recording URI
- `setTranscription(text: string | null)`: Set the transcribed text
- `setIsTranscribing(value: boolean)`: Update transcription state
- `transcribeRecording()`: Transcribe the current recording

### useAudioRecorder Hook (app/hooks/useAudioRecorder.ts)

```typescript
export function useAudioRecorder() {
  return {
    isRecording: boolean,
    recordingUri: string | null,
    toggleRecording: () => Promise<string | undefined>
  }
}
```

Features:
- Permission handling for microphone access
- Audio recording configuration
- Recording start/stop logic
- Automatic transcription on stop
- Automatic chat submission
- Cleanup on component unmount
- Error handling with alerts

### HudButtons Component (app/components/HudButtons.tsx)

```typescript
export const HudButtons = observer(({ onChatPress }: HudButtonsProps) => {
  // ... rendering logic
})
```

Features:
- Visual feedback during recording
- Toggle recording on mic button press
- Playback controls for last recording
- MobX integration via observer wrapper

## Usage Flow

1. **Start Recording**
   - Press mic button
   - Permission check
   - Start recording
   - Visual feedback

2. **Stop Recording**
   - Press mic button again
   - Save recording
   - Automatic transcription
   - Automatic chat submission

3. **Playback (Optional)**
   - Press play button to hear recording
   - Press stop to end playback

## Error Handling

Errors are handled at multiple levels:

1. Permission errors - User-friendly alerts
2. Recording errors - Console errors + user alerts
3. Cleanup errors - Logged but silent to user

## Dependencies

- expo-av: Handles audio recording
- mobx-state-tree: State management
- mobx-react-lite: React bindings for MobX