# Onyx Layout Documentation

The Onyx layout system consists of several components that handle text and voice input through modal interfaces. The system is designed to be modular, maintainable, and consistent in styling.

## Components

### OnyxLayout

The main component that handles the overall layout and state management. It displays two buttons at the bottom of the screen for text and voice input.

**Location**: `src/onyx/OnyxLayout.tsx`

**Features**:
- Bottom-aligned text and voice input buttons
- State management for both input modals
- Handles sending of text and voice messages

### TextInputModal

A full-screen modal component for text input that appears when the text button is pressed.

**Location**: `src/onyx/TextInputModal.tsx`

**Features**:
- Full-screen modal with semi-transparent background
- Cancel and Send buttons in header
- Expandable text input field
- Send button activates only when text is entered
- Keyboard-aware layout
- Dismissible via Cancel button or Android back button

### VoiceInputModal

A full-screen modal component for voice recording that appears when the voice button is pressed.

**Location**: `src/onyx/VoiceInputModal.tsx`

**Features**:
- Full-screen modal with semi-transparent background
- Cancel and Send buttons in header
- Centered recording interface (TODO)
- Voice recording controls (TODO)

### Shared Styles

Common styles used across the Onyx layout components.

**Location**: `src/onyx/styles.ts`

**Features**:
- Consistent styling for modals
- Shared button and text styles
- Layout constants
- Typography integration

## Usage

The layout is used by importing the OnyxLayout component:

```tsx
import { OnyxLayout } from "@/onyx/OnyxLayout"

export default function App() {
  return (
    <View style={styles.container}>
      <OnyxLayout />
    </View>
  )
}
```

## Styling

The layout uses a consistent style system with:
- Semi-transparent black modals (rgba(0,0,0,0.85))
- White text for active elements
- Gray (#666) text for inactive/disabled elements
- Standard font sizes (17px for text)
- Consistent padding and spacing
- Custom typography from the app's theme

## TODO

### Voice Input Implementation
The voice input modal is currently a placeholder. Future implementation needs:
1. Voice recording functionality
2. Recording visualization
3. Audio data handling
4. Recording controls (start/stop/pause)
5. Proper audio file format handling
6. Upload/sending mechanism

### General Improvements
1. Add loading states for send operations
2. Add error handling for failed sends
3. Add haptic feedback
4. Add animations for button presses
5. Add sound effects for recording start/stop
6. Improve keyboard handling on different devices
7. Add accessibility features

## Component Communication

The components communicate through props and callbacks:

```tsx
// Text input handling
const handleTextSend = (text: string) => {
  // Handle sending text message
}

// Voice input handling
const handleVoiceSend = (audioData: any) => {
  // Handle sending voice message
}

<TextInputModal
  visible={showTextInput}
  onClose={() => setShowTextInput(false)}
  onSend={handleTextSend}
/>
```

## Modal States

Both modals handle several states:
1. Hidden (default)
2. Visible/Active
3. Processing (when sending)
4. Error (when send fails)

The visibility is controlled by the parent OnyxLayout component through the `visible` prop.