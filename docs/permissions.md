# Permissions Documentation

This document outlines how permissions are handled in the Onyx app, particularly focusing on voice input functionality.

## Overview

Onyx requires certain permissions to enable voice input features. The permission requirements and handling differ between iOS and Android platforms.

## Required Permissions

### Android

- `RECORD_AUDIO` - Required for microphone access
- Speech recognition services are handled through Google's services

### iOS

- Microphone permission - Handled automatically by Voice API
- Speech recognition permission - Handled automatically by Voice API

## Implementation

### Permission Hook

The app uses a custom hook `useVoicePermissions` to manage voice-related permissions:

```typescript
import { useVoicePermissions } from "../hooks/useVoicePermissions"

// Usage in components
const { hasPermission, isChecking, requestPermissions } = useVoicePermissions()
```

The hook provides:

- `hasPermission`: Boolean indicating if required permissions are granted
- `isChecking`: Boolean indicating if permissions are being checked
- `requestPermissions()`: Function to request necessary permissions
- `checkPermissions()`: Function to check current permission status

### Platform-Specific Handling

#### Android

```typescript
// Using PermissionsAndroid API
const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, {
  title: "Microphone Permission",
  message: "Onyx needs access to your microphone for voice input",
  buttonNeutral: "Ask Me Later",
  buttonNegative: "Cancel",
  buttonPositive: "OK",
})
```

#### iOS

- Permissions are handled automatically by the Voice API
- No manual permission requests needed
- System permission dialogs appear when needed

## Voice Input Modal

The VoiceInputModal component uses the permissions hook to:

1. Check permissions when opened
2. Request permissions if needed
3. Show appropriate UI states:
   - Loading while checking permissions
   - Error if permissions denied
   - Recording UI when permissions granted

```typescript
const VoiceInputModal = () => {
  const { hasPermission, isChecking } = useVoicePermissions()

  useEffect(() => {
    if (visible && hasPermission) {
      startRecording()
    }
  }, [visible, hasPermission])

  // ... rest of the component
}
```

## Configuration

### Android Manifest

Required permissions are declared in `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

### iOS Info.plist

Required permission descriptions in `ios/[AppName]/Info.plist`:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>Onyx needs access to your microphone for voice input</string>
<key>NSSpeechRecognitionUsageDescription</key>
<string>Onyx needs access to speech recognition for voice input</string>
```

## Error Handling

The permission system handles several cases:

1. Permission denied
2. Permission not yet requested
3. System errors
4. Missing speech recognition services (Android)

Error messages are displayed to users with appropriate actions:

- Clear explanation of why permissions are needed
- Option to retry permission request
- Guidance for enabling permissions in settings

## Best Practices

1. **Request Timing**

   - Only request permissions when needed
   - Check permissions before starting voice input
   - Provide clear context for permission requests

2. **User Experience**

   - Show loading states during permission checks
   - Provide clear feedback for permission status
   - Gracefully handle permission denials

3. **Error Handling**

   - Catch and handle all permission-related errors
   - Provide clear error messages
   - Guide users to resolve permission issues

4. **Platform Differences**
   - Handle Android and iOS permissions appropriately
   - Account for different system behaviors
   - Test thoroughly on both platforms

## Testing

Test the following scenarios:

1. First-time permission requests
2. Permission denials
3. Permission grants
4. Permission revocation in settings
5. Re-requesting previously denied permissions

## Troubleshooting

Common issues and solutions:

1. **Permission Denied**

   - Guide users to app settings
   - Explain why permissions are needed
   - Provide retry option

2. **Android Speech Services**

   - Check Google app installation
   - Verify Google services availability
   - Handle offline scenarios

3. **iOS Permission Dialogs**
   - Ensure proper Info.plist setup
   - Handle system-level denials
   - Guide users to system settings

## Future Improvements

Planned enhancements:

1. Better permission denial handling
2. Offline voice recognition options
3. Enhanced error messages
4. Permission settings deep linking
5. Permission status persistence
