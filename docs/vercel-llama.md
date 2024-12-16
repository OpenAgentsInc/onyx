# Vercel AI SDK + Llama Integration

This document outlines how we integrate Llama.cpp with a Vercel AI SDK-like interface in the Onyx mobile app.

## Architecture Overview

The integration consists of three main parts:

1. **useLlamaVercelChat Hook** - Core integration layer
2. **useSharedChat Hook** - MobX state management layer
3. **RecordButtonOverlay** - UI component for voice input

```
Architecture Flow:

Voice Input -> Transcription -> Llama Processing -> MobX Store -> UI Update
     ↑              ↓               ↓                  ↓           ↑
RecordButton -> Recording Store -> Llama Context -> Chat Store -> Chat UI
```

## Core Components

### useLlamaVercelChat Hook

Primary interface for Llama chat functionality that mimics Vercel AI SDK's interface.

```typescript
interface LlamaVercelChat {
  append: (message: { role: string; content: string }) => Promise<{
    role: string;
    content: string;
    id: string;
  } | undefined>;
  error: Error | null;
  isLoading: boolean;
  handleModelInit: () => Promise<void>;
}
```

Key features:
- Model initialization and management
- Message processing
- Error handling
- Loading state management

### useSharedChat Hook

Bridges Llama chat with MobX state management.

```typescript
interface SharedChat {
  messages: Message[];
  error: Error | null;
  append: (message: { role: Message["role"]; content: string }) => Promise<any>;
  isLoading: boolean;
  handleModelInit: () => Promise<void>;
}
```

Responsibilities:
- Syncs messages with MobX store
- Maintains chat history
- Provides consistent interface for UI components

### RecordButtonOverlay Component

Voice input interface with visual feedback.

```typescript
interface RecordButtonProps {
  // No props required - uses hooks internally
}
```

Features:
- Voice recording
- Visual recording feedback
- Model initialization via long press
- Transcription handling

## State Management

### MobX Stores

1. **ChatStore**
```typescript
interface ChatStore {
  messages: Message[];
  showFullChat: boolean;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  clearMessages: () => void;
  toggleFullChat: () => void;
}
```

2. **RecordingStore**
```typescript
interface RecordingStore {
  isRecording: boolean;
  isTranscribing: boolean;
  recordingUri: string | null;
  transcribeRecording: () => Promise<string>;
}
```

## Message Flow

1. **Voice Input**
   ```typescript
   // RecordButtonOverlay.tsx
   const handlePress = async () => {
     const uri = await toggleRecording();
     if (uri && !isRecording) {
       const transcription = await recordingStore.transcribeRecording();
       await append({ role: "user", content: transcription });
     }
   };
   ```

2. **Llama Processing**
   ```typescript
   // useLlamaVercelChat.ts
   const append = async (message) => {
     const msgs = [SYSTEM_MESSAGE, message];
     const formattedChat = await context?.getFormattedChat(msgs);
     const completionResult = await context?.completion({
       messages: msgs,
       // ... completion parameters
     });
     return {
       role: "assistant",
       content: completionResult,
       id: randId(),
     };
   };
   ```

3. **State Update**
   ```typescript
   // useSharedChat.ts
   const appendMessage = async (message) => {
     const response = await append(message);
     if (response) {
       runInAction(() => {
         chatStore.addMessage({
           id: response.id,
           role: message.role,
           content: message.content,
           createdAt: new Date(),
         });
         chatStore.addMessage({
           id: response.id + "_response",
           role: "assistant",
           content: response.content,
           createdAt: new Date(),
         });
       });
     }
   };
   ```

## Model Parameters

Default Llama completion parameters:

```typescript
{
  n_predict: 1000,
  seed: -1,
  n_probs: 0,
  top_k: 40,
  top_p: 0.5,
  min_p: 0.05,
  temperature: 0.7,
  penalty_last_n: 64,
  penalty_repeat: 1.0,
  stop: [
    "</s>",
    "<|end|>",
    "<|im_end|>",
    "<|EOT|>",
    "<|end_of_turn|>",
    "<|endoftext|>",
    "</tool>",
  ],
}
```

## Usage

### Initialization
Long press the record button to initialize the Llama model:
```typescript
<TouchableOpacity
  onPress={handlePress}
  onLongPress={handleModelInit}
  style={$buttonContainer}
>
  {/* Button content */}
</TouchableOpacity>
```

### Recording
1. Press record button to start recording
2. Press again to stop recording
3. Recording is automatically transcribed
4. Transcription is sent to Llama
5. Response appears in chat

### Chat Interface
The chat interface automatically updates with:
- User messages (transcribed voice)
- Assistant responses (Llama output)
- Loading states
- Error messages

## Error Handling

The integration handles various error cases:
1. Model initialization failures
2. Recording errors
3. Transcription failures
4. Llama processing errors
5. State management errors

Example error handling:
```typescript
try {
  const transcription = await recordingStore.transcribeRecording();
  await append({ role: "user", content: transcription });
} catch (err) {
  console.error('Failed to process recording:', err);
  // Error state is automatically updated in stores
}
```

## Performance Considerations

1. **Model Loading**
   - Lazy initialization on first use
   - Model remains loaded until explicitly released
   - GPU acceleration when available

2. **Message Processing**
   - Streaming responses for better UX
   - Efficient state updates via MobX
   - Batched UI updates

3. **Memory Management**
   - Automatic context cleanup
   - Recording buffer management
   - State cleanup on unmount

## Future Improvements

1. **Enhanced Error Recovery**
   - Automatic model reinitialization
   - Graceful fallback options
   - Better error messages

2. **Performance Optimizations**
   - Message batching
   - Context window management
   - Memory usage optimization

3. **UI Enhancements**
   - Progress indicators
   - Model status display
   - Advanced settings interface

4. **Feature Additions**
   - Model switching
   - Parameter adjustment
   - Conversation management
   - Export/import functionality