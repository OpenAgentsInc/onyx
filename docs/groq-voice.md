# Groq Voice Integration

This document describes the voice transcription integration with Groq's Whisper API in Onyx, including implementation details, usage guidelines, and best practices.

## Overview

The voice integration combines Expo's AV recording capabilities with Groq's Whisper-based transcription service to provide high-quality speech-to-text functionality. This implementation replaces the previous react-native-voice solution with a more controlled and accurate transcription process.

## Architecture

### Components

1. **VoiceInputModal**
   - Handles audio recording UI/UX
   - Manages recording state and user interactions
   - Coordinates with Groq API for transcription
   - Integrates with ChatStore for message handling

2. **GroqChatApi**
   - Provides transcription service interface
   - Handles API communication
   - Manages error states and responses

3. **Expo AV**
   - Handles audio recording
   - Manages audio permissions
   - Provides audio file access

### Flow

```mermaid
sequenceDiagram
    participant User
    participant VoiceInputModal
    participant ExpoAV
    participant GroqAPI
    participant ChatStore

    User->>VoiceInputModal: Opens modal
    VoiceInputModal->>ExpoAV: Request permissions
    ExpoAV-->>VoiceInputModal: Permissions granted
    User->>VoiceInputModal: Taps record
    VoiceInputModal->>ExpoAV: Start recording
    User->>VoiceInputModal: Taps stop
    VoiceInputModal->>ExpoAV: Stop recording
    ExpoAV-->>VoiceInputModal: Audio file
    VoiceInputModal->>GroqAPI: Send for transcription
    GroqAPI-->>VoiceInputModal: Transcribed text
    User->>VoiceInputModal: Taps send
    VoiceInputModal->>ChatStore: Send message
```

## Implementation

### API Types

```typescript
// Transcription configuration
interface TranscriptionConfig {
  model: string
  language?: string
  prompt?: string
  response_format?: "json" | "text" | "verbose_json"
  temperature?: number
  timestamp_granularities?: ("word" | "segment")[]
}

// API Response
interface TranscriptionResponse {
  text: string
  x_groq: {
    id: string
  }
}
```

### Recording Setup

```typescript
// Initialize audio recording
const setupRecording = async () => {
  await Audio.requestPermissionsAsync()
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
  })
}

// Start recording
const startRecording = async () => {
  const { recording } = await Audio.Recording.createAsync(
    Audio.RecordingOptionsPresets.HIGH_QUALITY
  )
  return recording
}
```

### Transcription Process

```typescript
// In GroqChatApi
async transcribeAudio(
  audioFile: Blob,
  config: Partial<TranscriptionConfig> = {}
): Promise<{ kind: "ok"; response: TranscriptionResponse } | GeneralApiProblem> {
  const formData = new FormData()
  formData.append("file", audioFile)
  formData.append("model", config.model || "whisper-large-v3")
  
  // Add optional configuration
  if (config.language) formData.append("language", config.language)
  if (config.prompt) formData.append("prompt", config.prompt)
  
  const response = await this.apisauce.post("/audio/transcriptions", formData)
  // Handle response...
}
```

## Configuration

### Environment Variables

```bash
GROQ_API_KEY=your_api_key_here
```

### Default Configuration

```typescript
const DEFAULT_CONFIG: GroqConfig = {
  apiKey: Config.GROQ_API_KEY ?? "",
  baseURL: "https://api.groq.com/openai/v1",
  timeout: 30000,
}
```

### Audio Recording Options

```typescript
const RECORDING_OPTIONS = {
  ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
  android: {
    ...Audio.RecordingOptionsPresets.HIGH_QUALITY.android,
    extension: '.m4a',
    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
  },
  ios: {
    ...Audio.RecordingOptionsPresets.HIGH_QUALITY.ios,
    extension: '.m4a',
    outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
  },
}
```

## Usage

### Basic Implementation

```typescript
const VoiceInput = () => {
  const [isRecording, setIsRecording] = useState(false)
  const recording = useRef<Audio.Recording | null>(null)

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync()
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      )
      recording.current = newRecording
      setIsRecording(true)
    } catch (err) {
      console.error("Failed to start recording", err)
    }
  }

  // ... rest of implementation
}
```

### Error Handling

The implementation includes comprehensive error handling at multiple levels:

1. **Recording Errors**
   - Permission denials
   - Hardware issues
   - File system errors

2. **Transcription Errors**
   - API communication failures
   - Invalid audio format
   - Transcription processing errors

3. **UI Error States**
   - Visual feedback for errors
   - Retry mechanisms
   - Clear error messages

## Best Practices

1. **Audio Quality**
   - Use HIGH_QUALITY preset for best transcription results
   - Ensure good microphone access and positioning
   - Monitor audio levels for optimal input

2. **Error Handling**
   - Implement comprehensive error handling
   - Provide clear user feedback
   - Include retry mechanisms
   - Log errors appropriately

3. **User Experience**
   - Show clear recording status
   - Provide visual feedback for all states
   - Implement confirmation for long recordings
   - Allow preview before sending

4. **Performance**
   - Clean up resources after use
   - Handle background/foreground transitions
   - Manage memory usage for long recordings

## Limitations

1. **Audio Format Support**
   - Supported formats: flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, webm
   - Maximum file size: 25MB
   - Optimal quality vs. size balance needed

2. **API Constraints**
   - Rate limiting considerations
   - Timeout handling for long files
   - Cost considerations for API usage

## Future Improvements

1. **Enhanced Features**
   - Real-time transcription streaming
   - Multiple language support
   - Speaker diarization
   - Noise reduction

2. **Performance Optimizations**
   - Audio compression
   - Caching mechanisms
   - Offline support

3. **User Experience**
   - Waveform visualization
   - Audio playback preview
   - Enhanced error recovery

## Resources

- [Groq API Documentation](https://console.groq.com/docs/api-reference)
- [Expo AV Documentation](https://docs.expo.dev/versions/latest/sdk/audio/)
- [Whisper Model Documentation](https://console.groq.com/docs/models#whisper)

## Testing

When implementing voice features:

1. Test various recording durations
2. Verify error handling paths
3. Test in different noise environments
4. Verify memory usage
5. Test background/foreground transitions
6. Verify cleanup on modal close