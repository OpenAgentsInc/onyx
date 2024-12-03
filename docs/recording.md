# Audio Recording System

The Onyx audio recording system provides voice recording capabilities using Expo's AV API. The system is built with MobX State Tree for state management and follows React Native best practices.

## Architecture

The recording system consists of four main parts:

1. **RecordingStore** - MobX State Tree model for state management
2. **useAudioRecorder** - React hook for audio recording logic
3. **HudButtons** - UI component with recording controls
4. **Permissions** - Configuration in app.json for iOS and Android

### RecordingStore (app/models/RecordingStore.ts)

```typescript
export const RecordingStoreModel = types
  .model("RecordingStore")
  .props({
    isRecording: false,
    recordingUri: types.maybeNull(types.string),
  })
  .actions((store) => ({
    setIsRecording(value: boolean),
    setRecordingUri(uri: string | null),
    clearRecording(),
  }))
```

### useAudioRecorder Hook (app/hooks/useAudioRecorder.ts)

The hook manages the recording lifecycle and handles:
- Permission requests
- Recording start/stop
- State management
- Error handling
- Cleanup

Key features:
- Uses `useRef` to persist recording instance between renders
- Proper cleanup on unmount
- Automatic state reset on errors
- Comprehensive error handling

```typescript
export function useAudioRecorder() {
  return {
    isRecording: boolean,
    recordingUri: string | null,
    toggleRecording: () => Promise<string | undefined>
  }
}
```

### HudButtons Component (app/components/HudButtons.tsx)

Provides the UI for:
- Recording toggle button
- Recording status display
- Last recording URI display
- Visual feedback during recording

## Permissions

### iOS Configuration
```json
{
  "ios": {
    "infoPlist": {
      "NSMicrophoneUsageDescription": "Allow Onyx to access your microphone for voice recording."
    }
  }
}
```

### Android Configuration
```json
{
  "android": {
    "permissions": [
      "RECORD_AUDIO"
    ]
  }
}
```

### Expo Plugin Configuration
```json
{
  "plugins": [
    [
      "expo-av",
      {
        "microphonePermission": "Allow Onyx to access your microphone for voice recording."
      }
    ]
  ]
}
```

## Usage

### Basic Recording
```typescript
const MyComponent = () => {
  const { isRecording, recordingUri, toggleRecording } = useAudioRecorder()
  
  return (
    <Button 
      onPress={toggleRecording}
      title={isRecording ? "Stop Recording" : "Start Recording"}
    />
  )
}
```

### Accessing Recording State
```typescript
import { useStores } from "../models"

function MyComponent() {
  const { recordingStore } = useStores()
  
  console.log("Is recording:", recordingStore.isRecording)
  console.log("Recording URI:", recordingStore.recordingUri)
}
```

## Error Handling

The system handles several types of errors:
1. Permission errors - User-friendly alerts
2. Recording errors - Console errors + user alerts
3. Cleanup errors - Logged but silent to user

Error states automatically:
- Reset recording state
- Clean up resources
- Update UI
- Log details for debugging

## Implementation Details

### Recording Lifecycle

1. **Start Recording**:
   - Check permissions
   - Configure audio mode
   - Create new recording instance
   - Start recording
   - Update state

2. **Stop Recording**:
   - Stop and unload recording
   - Get recording URI
   - Reset audio mode
   - Update state
   - Clean up resources

3. **Cleanup**:
   - Stop any active recording
   - Reset state
   - Release resources

### State Management

The recording state is managed through MobX State Tree, providing:
- Centralized state management
- Automatic state synchronization
- Persistent state between renders
- Type safety

## Future Improvements

Potential enhancements:
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