# Chat Integration Documentation

## Overview

This document describes the integration between the Onyx chat system and the llama.rn model inference system.

## Architecture

The integration happens primarily in the `useChatStore` hook, which connects the UI components (TextInputModal, VoiceInputModal) to the underlying model.

### Key Components

1. **Chat Store**
   - Manages messages and conversation state
   - Handles model context and active model selection
   - Maintains inferencing state

2. **Input Modals**
   - TextInputModal: Text input interface
   - VoiceInputModal: Voice input interface
   - Both use `useChatStore.sendMessage()`

3. **Model Integration**
   - Uses llama.rn's completion API
   - Handles streaming responses
   - Manages model context

## Message Flow

1. **User Input**
   ```
   TextInputModal/VoiceInputModal
   → useChatStore.sendMessage()
   → chatStore.addMessage() (user message)
   → model.completion()
   → streaming updates
   → chatStore.addMessage() (assistant response)
   ```

2. **Message Processing**
   - Format conversation history for model
   - Stream response tokens
   - Update UI in real-time
   - Handle completion/errors

## Implementation Details

### Message Formatting

```typescript
const formatMessages = (messages: Message[]) => {
  return [
    systemMessage,
    ...messages
      .filter(msg => !msg.metadata?.system)
      .map(msg => ({
        role: msg.role,
        content: msg.text
      }))
  ]
}
```

### Completion Parameters

```typescript
const completionParams = {
  messages: formattedMessages,
  n_predict: 100,
  temperature: 0.7,
  top_k: 40,
  top_p: 0.5,
  stop: [
    "</s>",
    "<|end|>",
    "<|im_end|>",
    "<|endoftext|>"
  ]
}
```

### Streaming Response

```typescript
context.completion(
  completionParams,
  (token) => {
    // Update message in real-time
    updateMessage(messageId, {
      text: currentText + token
    })
  }
)
```

## Error Handling

1. **Context Errors**
   - No active context
   - Model not loaded
   - Context initialization failed

2. **Inference Errors**
   - Completion failed
   - Token generation error
   - Context overflow

3. **State Management Errors**
   - Message update failed
   - State synchronization issues

## Best Practices

1. **Message Management**
   - Keep conversation history organized
   - Clean up old messages when needed
   - Maintain metadata consistency

2. **Model Interaction**
   - Handle context properly
   - Clean up resources
   - Monitor memory usage

3. **Error Handling**
   - Provide clear error messages
   - Recover gracefully from failures
   - Maintain UI responsiveness

## Future Improvements

1. **Performance**
   - Message batching
   - Context window optimization
   - Memory management

2. **Features**
   - Advanced prompt formatting
   - Context preservation
   - Model parameter tuning

3. **UX**
   - Progress indicators
   - Token count display
   - Model status feedback