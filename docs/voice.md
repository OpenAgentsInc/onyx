# Voice Input Documentation

The Onyx app includes voice input functionality using `@react-native-voice/voice` for speech-to-text conversion. This document explains the implementation, requirements, and usage.

## Overview

Voice input allows users to:
- Record speech through the device microphone
- Convert speech to text in real-time
- Send transcribed text messages
- See feedback about recording status and errors

## Technical Implementation

### Dependencies

```json
{
  "@react-native-voice/voice": "latest"
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
      ]
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

### Integration with OnyxLayout

The voice functionality is integrated into the main layout through:
- Voice input button in the bottom toolbar
- Modal display for recording interface
- Consistent message handling for both text and voice input

## Usage Flow

1. **Starting Recording**
   - Tap the microphone icon in the bottom toolbar
   - Modal appears with recording interface
   - Tap "Start Recording" button
   - Permission requests appear if not already granted

2. **During Recording**
   - Red recording indicator shows active recording
   - "Listening..." text appears
   - Transcribed text appears in real-time
   - Tap "Stop" to end recording

3. **After Recording**
   - Review transcribed text
   - Tap "Send" to send the message
   - Tap "Cancel" to discard and close
   - Can start new recording if needed

## Platform-Specific Notes

### Android Requirements
- Requires Google's speech recognition service
- Device must have Google Search App installed for speech recognition
- Can be checked with `Voice.getSpeechRecognitionServices()`
- Users without Google Services need alternative input methods

### iOS Requirements
- Uses built-in iOS speech recognition
- Requires iOS 10 or later
- Works offline after initial setup
- More consistent availability than Android

## Development Notes

### Building
- Cannot be used in Expo Go
- Requires native builds:
```bash
npx expo install @react-native-voice/voice
npx expo prebuild
```

### Testing
- Test on both platforms
- Verify permissions flow
- Check error handling
- Test with different accents/languages
- Verify offline behavior

### Common Issues

1. **Permissions**
   - Ensure all permissions are properly configured
   - Handle permission denial gracefully
   - Provide clear permission request messages

2. **Android Speech Service**
   - Check for Google Search App availability
   - Handle devices without Google Services
   - Provide user feedback for missing services

3. **Error Handling**
   - Network connectivity issues
   - Service availability
   - Permission denials
   - Recording timeouts

## Future Improvements

1. **Features**
   - Language selection
   - Voice command recognition
   - Offline mode support
   - Custom wake words
   - Audio feedback/sounds

2. **UI/UX**
   - Visual voice level indicator
   - Better error messaging
   - Haptic feedback
   - Accessibility improvements
   - Tutorial/onboarding

3. **Performance**
   - Optimize transcription speed
   - Reduce battery impact
   - Improve accuracy
   - Handle poor network conditions

## Contributing

When modifying voice functionality:
1. Test on both platforms
2. Verify permissions flow
3. Handle errors gracefully
4. Maintain consistent UI/UX
5. Update documentation
6. Consider accessibility