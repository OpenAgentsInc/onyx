# Recording System Documentation

The Onyx recording system provides audio recording capabilities using Expo's Audio API, managed through MobX State Tree. This document outlines the architecture and usage of the recording system.

## Architecture

The recording system consists of three main parts:

1. **RecordingStore** - MobX State Tree model for state management
2. **useAudioRecorder** - React hook for audio recording logic
3. **HudButtons** - UI component with recording controls

### RecordingStore

Located in `app/models/RecordingStore.ts`, this store manages the recording state:

```typescript
export const RecordingStoreModel = types
  .model("RecordingStore")
  .props({
    isRecording: false,
    recordingUri: types.maybeNull(types.string),
  })
```

Properties:
- `isRecording`: Boolean flag indicating if recording is in progress
- `recordingUri`: String containing the URI of the last recording (null if none)

Actions:
- `setIsRecording(value: boolean)`: Update recording state
- `setRecordingUri(uri: string | null)`: Set the URI of the recorded audio
- `clearRecording()`: Clear the current recording URI

Views:
- `hasRecording`: Computed property that returns true if there's a recording

### useAudioRecorder Hook

Located in `app/hooks/useAudioRecorder.ts`, this hook handles all audio recording logic:

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
- Cleanup on component unmount
- Error handling with alerts

### HudButtons Component

Located in `app/components/HudButtons.tsx`, this component provides the recording UI:

```typescript
export const HudButtons = observer(({ onChatPress }: HudButtonsProps) => {
  const { isRecording, toggleRecording } = useAudioRecorder()
  // ... rendering logic
})
```

Features:
- Visual feedback during recording
- Toggle recording on mic button press
- MobX integration via observer wrapper

## Usage

### Basic Usage

```typescript
import { useStores } from "../models"

function MyComponent() {
  const { recordingStore } = useStores()
  
  // Access recording state
  console.log("Is recording:", recordingStore.isRecording)
  console.log("Recording URI:", recordingStore.recordingUri)
}
```

### Using the Hook

```typescript
import { useAudioRecorder } from "../hooks/useAudioRecorder"

function MyRecordingComponent() {
  const { isRecording, recordingUri, toggleRecording } = useAudioRecorder()
  
  return (
    <Button 
      onPress={toggleRecording}
      title={isRecording ? "Stop Recording" : "Start Recording"}
    />
  )
}
```

## Server Integration

The current implementation includes placeholder logging for server integration. To implement server uploads:

1. Modify `useAudioRecorder.ts`
2. Find the TODO comment in `stopRecording()`
3. Replace the console.log with your upload logic:

```typescript
const stopRecording = async () => {
  // ... existing stop logic ...
  
  // Add your upload logic here
  try {
    await uploadRecording(uri)
  } catch (err) {
    console.error("Failed to upload recording:", err)
  }
}
```

## Permissions

The system automatically handles microphone permissions:

1. Requests permissions on first recording attempt
2. Shows an alert if permissions are denied
3. Provides feedback to the user about permission status

## Error Handling

Errors are handled at multiple levels:

1. Permission errors - User-friendly alerts
2. Recording errors - Console errors + user alerts
3. Cleanup errors - Logged but silent to user

## Future Improvements

Potential areas for enhancement:

1. Add recording quality settings
2. Implement waveform visualization
3. Add recording time limit
4. Add background recording capability
5. Implement recording compression
6. Add recording playback preview
7. Implement batch upload handling

## Dependencies

- expo-av: Handles audio recording
- mobx-state-tree: State management
- mobx-react-lite: React bindings for MobX