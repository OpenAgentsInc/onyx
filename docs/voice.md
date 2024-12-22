# Voice Input/Output Documentation

The Onyx app includes both speech-to-text and text-to-speech functionality using `@react-native-voice/voice` and `expo-speech` respectively. This document explains the implementation, requirements, and usage.

## Overview

### Speech-to-Text (Voice Input)
- Record speech through the device microphone
- Convert speech to text in real-time
- Send transcribed text messages
- See feedback about recording status and errors

### Text-to-Speech (Voice Output)
- Convert text to spoken words
- Control speech rate and pitch
- Multiple language support
- Voice selection options

## Technical Implementation

### Dependencies

```json
{
  "@react-native-voice/voice": "latest",
  "expo-speech": "latest"
}
```

### Configuration

The voice functionality is configured in `app.json` using the Expo config plugin system:

```json
{
  "expo": {
    "plugins": [
      [
        "@react-native-voice/voice",
        {
          "microphonePermission": "Allow Onyx to access your microphone for voice commands",
          "speechRecognitionPermission": "Allow Onyx to securely recognize your speech"
        }
      ],
      "expo-speech"
    ]
  }
}
```

### Permissions

#### Android
- `RECORD_AUDIO`
- `android.permission.RECORD_AUDIO`
- `android.permission.MODIFY_AUDIO_SETTINGS`

#### iOS
- `NSMicrophoneUsageDescription`
- `NSSpeechRecognitionUsageDescription`

## Components

### VoiceInputModal

Located in `src/onyx/VoiceInputModal.tsx`, this component handles:
- Voice recording UI
- Speech recognition
- Error handling
- Transcription display

Key features:
- Start/stop recording button
- Real-time transcription display
- Error feedback
- Send/Cancel options

### Text-to-Speech Usage

```typescript
import * as Speech from 'expo-speech';

// Basic usage
await Speech.speak('Hello world');

// Advanced usage
await Speech.speak('Hello world', {
  language: 'en-US',
  pitch: 1.0,
  rate: 1.0,
  onStart: () => console.log('Started speaking'),
  onDone: () => console.log('Done speaking'),
  onStopped: () => console.log('Stopped speaking'),
  onError: (error) => console.log('Error:', error)
});

// Stop speaking
await Speech.stop();

// Get available voices
const voices = await Speech.getAvailableVoicesAsync();
```

### Integration with OnyxLayout

The voice functionality is integrated into the main layout through:
- Voice input button in the bottom toolbar
- Modal display for recording interface
- Consistent message handling for both text and voice input
- Text-to-speech options for received messages

## Usage Flow

### Speech-to-Text
1. **Starting Recording**
   - Tap the microphone icon
   - Modal appears with recording interface
   - Tap "Start Recording" button
   - Permission requests appear if not granted

2. **During Recording**
   - Red recording indicator shows active recording
   - "Listening..." text appears
   - Transcribed text appears in real-time
   - Tap "Stop" to end recording

3. **After Recording**
   - Review transcribed text
   - Tap "Send" to send the message
   - Tap "Cancel" to discard and close

### Text-to-Speech
1. **Basic Playback**
   - Call `Speech.speak(text)`
   - Text is spoken using default settings

2. **Advanced Options**
   - Set language/locale
   - Adjust pitch and rate
   - Select specific voices
   - Handle playback events

3. **Control**
   - Stop playback with `Speech.stop()`
   - Check status with `Speech.isSpeakingAsync()`

## Platform-Specific Notes

### Android Requirements
- Requires Google's speech recognition service for STT
- Uses system TTS engine for speech output
- Device must have Google Search App installed for STT
- Can check services with `Voice.getSpeechRecognitionServices()`

### iOS Requirements
- Uses built-in iOS speech recognition for STT
- Native iOS TTS engine for speech output
- Requires iOS 10 or later
- Works offline after initial setup

## Development Notes

### Installation
```bash
npx expo install @react-native-voice/voice expo-speech
npx expo prebuild
```

### Testing
- Test on both platforms
- Verify permissions flow
- Check error handling
- Test with different accents/languages
- Verify offline behavior
- Test TTS with various text lengths

### Common Issues

1. **Permissions**
   - Ensure all permissions are properly configured
   - Handle permission denial gracefully
   - Provide clear permission request messages

2. **Android Speech Service**
   - Check for Google Search App availability
   - Handle devices without Google Services
   - Verify TTS engine installation

3. **Error Handling**
   - Network connectivity issues
   - Service availability
   - Permission denials
   - Recording timeouts
   - TTS engine errors

## Future Improvements

1. **Features**
   - Language selection UI
   - Voice command recognition
   - Offline mode support
   - Custom wake words
   - Voice profile selection
   - Message reading options

2. **UI/UX**
   - Visual voice level indicator
   - Better error messaging
   - Haptic feedback
   - Accessibility improvements
   - TTS controls interface

3. **Performance**
   - Optimize transcription speed
   - Reduce battery impact
   - Improve accuracy
   - Handle poor network conditions
   - Cache TTS audio

## Contributing

When modifying voice functionality:
1. Test on both platforms
2. Verify permissions flow
3. Handle errors gracefully
4. Maintain consistent UI/UX
5. Update documentation
6. Consider accessibility
7. Test both STT and TTS features