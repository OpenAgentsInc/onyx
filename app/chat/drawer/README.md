# Chat Drawer Components

This directory contains the components and utilities for the chat drawer functionality in the Onyx app.

## Directory Structure

```
app/chat/drawer/
├── ChatDrawerLayout.tsx   # Main layout wrapper component
├── ChatList.tsx          # Chat history list component
├── ChatPreview.ts        # Chat preview utilities
├── NewChatButton.tsx     # New chat button component
├── WalletButton.tsx      # Wallet button component
├── index.tsx            # Main exports and drawer content
├── styles.ts            # Shared styles
└── README.md            # This file
```

## Component Overview

### ChatDrawerLayout.tsx
- Main container that manages the drawer state and layout
- Wraps both the drawer content and main chat interface
- Uses react-native-drawer-layout for drawer functionality
- Props: None (self-contained with internal state)

### ChatList.tsx
- Displays the list of chat history
- Handles chat selection
- Props:
  - `setOpen: (open: boolean) => void` - Function to control drawer state

### ChatPreview.ts
Utility functions for chat management:
- `getChatPreview(messages: any[])` - Generates preview text from chat messages
- `sortChats(chats: any[])` - Sorts chats by creation time

### NewChatButton.tsx
- Button component for creating new chats
- Handles chat creation logic
- Props:
  - `setOpen: (open: boolean) => void` - Function to control drawer state

### WalletButton.tsx
- Button component for wallet functionality
- Displays wallet balance and navigation
- Props:
  - `setOpen: (open: boolean) => void` - Function to control drawer state

### index.tsx
- Main entry point for drawer components
- Exports ChatDrawerContent and ChatDrawerLayout
- ChatDrawerContent Props:
  - `drawerInsets: any` - Safe area insets for proper layout
  - `setOpen: (open: boolean) => void` - Drawer state control

### styles.ts
- Centralized styles for all drawer components
- Uses theme colors and typography from @/theme

## Making Changes

### Adding New Features
1. For new UI elements:
   - Create a new component file in this directory
   - Add styles to styles.ts
   - Export the component in index.tsx if needed externally

2. For new functionality:
   - Add utility functions to appropriate files or create new ones
   - Update types as needed
   - Consider impacts on state management in ChatDrawerLayout

### Modifying Existing Features
1. Styles:
   - All styles are in styles.ts
   - Follow existing pattern for consistency
   - Use theme variables from @/theme

2. Chat List:
   - Chat preview logic is in ChatPreview.ts
   - Sort/filter logic should go there as well

3. State Management:
   - Drawer open/close state is managed in ChatDrawerLayout
   - Chat state is managed through chatStore (from @/models)

### Best Practices
- Keep components focused and single-responsibility
- Use consistent prop naming (e.g., setOpen for drawer control)
- Maintain type safety (avoid 'any' where possible)
- Follow existing patterns for styling and state management
- Add comments for complex logic
- Update this README when adding new components or changing architecture

## Common Tasks

### Adding a New Button
1. Create new component file (e.g., MyButton.tsx)
2. Add styles to styles.ts
3. Add component to ChatDrawerContent in index.tsx

### Modifying Chat Preview
1. Update logic in ChatPreview.ts
2. Test with different message formats
3. Update ChatList.tsx if display changes needed

### Adding New State
1. Consider whether it belongs in chatStore or local state
2. If local, add to relevant component
3. If global, add to chatStore in @/models

## Dependencies
- react-native-drawer-layout
- mobx-react-lite (for state management)
- @/models (for chat and wallet stores)
- @/theme (for styling)