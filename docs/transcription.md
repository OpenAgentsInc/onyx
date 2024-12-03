# Transcription System Documentation

The Onyx transcription system provides speech-to-text capabilities for recorded audio. It integrates with the recording system and maintains the app's futuristic black-and-white HUD theme.

## Architecture

The transcription system consists of four main parts:

1. **TranscriptionService** - API integration for audio transcription
2. **RecordingStore** - State management for transcription
3. **TranscriptionModal** - UI component for displaying results
4. **HudButtons** - UI integration and controls

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
    showTranscription: false,
  })
```

Properties:
- `transcription`: The transcribed text
- `isTranscribing`: Loading state flag
- `showTranscription`: Modal visibility control

Actions:
- `transcribeRecording()`: Initiates transcription
- `setTranscription()`: Updates transcription text
- `setIsTranscribing()`: Updates loading state
- `setShowTranscription()`: Controls modal visibility

### TranscriptionModal (app/components/TranscriptionModal.tsx)

Displays transcription results in a modal overlay:

```typescript
interface TranscriptionModalProps {
  visible: boolean
  text: string
  onClose: () => void
}
```

Features:
- Clean, minimal design
- Copy to clipboard functionality
- Responsive layout
- Smooth animations
- Close on overlay click
- Styled to match app theme

### HudButtons Integration (app/components/HudButtons.tsx)

Provides user interface for transcription:

```typescript
const HudButtons = observer(({ onChatPress }: HudButtonsProps) => {
  // ... existing recording logic ...

  const handleTranscribePress = async () => {
    await recordingStore.transcribeRecording()
  }

  // ... render buttons including transcribe button ...
})
```

Features:
- Transcribe button with icon
- Visual feedback during transcription
- Integration with recording system
- Modal trigger handling

## Usage Flow

1. **Record Audio**
   - Press mic button to start recording
   - Press again to stop recording
   - Recording is saved locally

2. **Transcribe Audio**
   - Press text button (appears after recording)
   - Button shows processing state
   - Transcription is processed server-side

3. **View Results**
   - Modal appears with transcribed text
   - Copy text using copy button
   - Close modal when done

4. **Error Handling**
   - User-friendly error messages
   - Automatic state recovery
   - Detailed error logging

## Styling

The system maintains the app's futuristic HUD theme:

```typescript
const styles = StyleSheet.create({
  button: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderColor: colors.palette.neutral300,
    // ... other button styles
  },
  transcribingButton: {
    borderColor: colors.palette.secondary300,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
})
```

Features:
- Consistent with app theme
- Clear visual states
- Smooth transitions
- High contrast for readability

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
   - Modal display problems
   - Clipboard errors

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

2. **UI/UX**
   - Progress indicators
   - Word highlighting
   - Editing capabilities
   - Voice command triggers

3. **Performance**
   - Caching
   - Offline support
   - Batch processing
   - Compression options

## Dependencies

- mobx-state-tree: State management
- expo-av: Audio handling
- react-native: UI components
- typescript: Type safety