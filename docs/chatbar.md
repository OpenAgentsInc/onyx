# ChatBar Component Behavior Requirements

## Voice Recording

### Recording Controls
- Mic button toggles recording state
- Send button (arrow) should be white and enabled during recording
- Components should be disabled during processing state

### Recording Modes
1. **Normal Recording** (Mic Button)
   - Start recording with mic button
   - Stop recording with mic button
   - Transcribed text appears in input field
   - If there's existing text, new transcription is appended with a space
   - Does not auto-focus input or show keyboard after transcription

2. **Immediate Send** (Arrow Button)
   - Start recording with mic button
   - Hit send button while recording
   - Transcription is sent immediately when ready
   - Text never appears in input field
   - Keyboard stays in current state (shown/hidden)

### Keyboard Behavior
- Keyboard should not be dismissed when starting recording
- Keyboard should not auto-show after transcription
- Keyboard should only be dismissed when sending typed text
- Expanded state should be preserved during recording

### Visual Feedback
- Mic button turns white when recording
- Send button turns white during recording or when text is present
- Small thinking animation appears below input during processing
- Processing animation should not affect layout or push content

### Text Handling
- All transcribed text should be trimmed of extra whitespace
- When appending transcriptions, maintain single space between segments
- Empty or whitespace-only text should not enable send button

## General Input
- Multiline input with dynamic height
- Maximum height of 240px
- Preserves safe area insets
- Maintains proper padding and margins in all states