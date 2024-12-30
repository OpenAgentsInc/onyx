# ChatBar Component Behavior Requirements

## Positioning & Layout

### Container Positioning
- Fixed to bottom of screen using absolute positioning
- Moves up with keyboard when it appears
- Always visible, never scrolls with content
- Background color transparent to allow proper layering
- Position styles:
  ```js
  {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent'
  }
  ```

### Container Layout
- Maintains proper padding and margins in all states
- Preserves safe area insets
- Proper vertical alignment with mic and send buttons
- Consistent spacing between elements regardless of height
- 14px horizontal padding on container
- 16px spacing between mic button and input
- 12px spacing between input and send button

## Voice Recording

### Recording Controls
- Mic button toggles recording state
- Send button (arrow) should be white and enabled during recording
- Components should be disabled during processing state
- Mic button should be a perfect 36x36 circle with centered icon
- Send button should be a perfect 28x28 circle with centered icon

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
   - Transcription is combined with any existing text and sent immediately
   - Input is cleared after sending
   - Keyboard stays in current state (shown/hidden)

### Keyboard Behavior
- Keyboard should not be dismissed when starting recording
- Keyboard should not auto-show after transcription
- Keyboard should only be dismissed when sending typed text
- Expanded state should be preserved during recording

### Visual Feedback
- Mic button turns white when recording
- Send button turns white during recording or when text is present
- Small thinking animation appears inline at end of text during processing
- Processing animation should not affect layout or push content
- Thinking animation should be 16x16 and aligned with text baseline

### Text Handling
- All transcribed text should be trimmed of extra whitespace
- When appending transcriptions, maintain single space between segments
- Empty or whitespace-only text should not enable send button
- When sending immediately, combine existing text with new transcription
- Clear input after successful immediate send

## Input Field Behavior

### Height Behavior
- Input field should dynamically resize based on content in both expanded and collapsed states
- Container uses minHeight: 50px with 8px vertical padding
- Input area uses minHeight: 34px
- Content maximum height of 240px
- Height changes should be smooth and maintain layout
- Same height behavior whether keyboard is shown or hidden

### Text Input
- Multiline input enabled
- Maintains proper line breaks
- Scrollable when content exceeds maximum height
- Preserves cursor position during height changes
- Opacity slightly reduced when not expanded
- Placeholder text vertically centered when single line