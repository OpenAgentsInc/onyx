# Model Switching in Onyx

This document describes the model switching functionality in Onyx, which allows users to switch between different language models (Groq and Gemini) for chat interactions.

## Overview

Onyx supports multiple language models through a unified interface, allowing users to switch between models while maintaining a consistent chat experience. The current implementation supports:

- Groq (llama-3.1-8b-instant)
- Google's Gemini

## Architecture

### 1. State Management

The model selection is managed in the ChatStore using MobX-State-Tree:

```typescript
const ChatStoreModel = types
  .model("ChatStore")
  .props({
    // ... other props
    activeModel: types.optional(types.enumeration(["groq", "gemini"]), "groq"),
  })
  .actions((self) => ({
    // ... other actions
    setActiveModel(model: "groq" | "gemini") {
      self.activeModel = model
    }
  }))
```

### 2. User Interface

The model switching interface is implemented through the ConfigureModal component:

```typescript
export const ConfigureModal = observer(({ visible, onClose }) => {
  const { chatStore } = useStores()

  const handleModelChange = (model: "groq" | "gemini") => {
    chatStore.setActiveModel(model)
    onClose()
  }

  // ... render UI
})
```

### 3. Message Processing

Messages are processed differently depending on the selected model:

```typescript
if (self.activeModel === "groq") {
  result = yield groqChatApi.createChatCompletion(
    self.currentMessages,
    "llama-3.1-8b-instant",
    {
      temperature: 0.7,
      max_tokens: 1024,
    },
  )
} else {
  result = yield geminiChatApi.createChatCompletion(
    self.currentMessages,
    {
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
  )
}
```

## Model Differences

### Groq
- Uses llama-3.1-8b-instant model
- Configured with max_tokens parameter
- Faster response times
- More consistent output format

### Gemini
- Uses Google's Gemini model
- Configured with maxOutputTokens parameter
- Better at complex reasoning
- More capable with multimodal inputs (future feature)

## Implementation Details

### 1. Store Configuration

The ChatStore maintains:
- Current model selection
- Message history
- Generation state
- Error handling

### 2. UI Components

The configuration interface includes:
- Model selection buttons
- Visual indication of active model
- Consistent styling with other modals

### 3. Message Handling

Each message includes metadata about:
- Which model generated it
- Token usage
- Error states
- Generation status

## Usage

### User Perspective

1. Open the Configure modal using the configure button
2. Select desired model (Groq or Gemini)
3. Continue chat with selected model
4. Model selection persists across sessions

### Developer Perspective

1. Access current model:
```typescript
const { chatStore } = useStores()
const currentModel = chatStore.activeModel
```

2. Switch models:
```typescript
chatStore.setActiveModel("gemini")
```

3. Check message metadata:
```typescript
message.metadata.model // "groq" or "gemini"
message.metadata.tokens // token usage
```

## Error Handling

The system handles various error cases:
- API failures
- Rate limiting
- Invalid responses
- Network issues

Error messages include:
- Model-specific error codes
- User-friendly messages
- Detailed logging in development

## Future Enhancements

1. Additional Models
- Support for more Groq models
- Additional Gemini model variants
- Other API providers

2. Model Features
- Model-specific temperature controls
- Token limit adjustments
- Specialized prompts per model

3. UI Improvements
- Model performance metrics
- Cost tracking
- Usage statistics

## Best Practices

1. Model Selection
- Choose Groq for faster responses
- Use Gemini for complex reasoning
- Consider token limits for each model

2. Error Handling
- Always check response status
- Provide clear error messages
- Log detailed errors in development

3. Message Processing
- Include model info in metadata
- Track token usage
- Handle model-specific response formats

## Testing

1. Unit Tests
- Model switching logic
- Error handling
- State management

2. Integration Tests
- API interactions
- UI functionality
- Error scenarios

3. End-to-end Tests
- Complete chat flows
- Model switching flows
- Error recovery

## Resources

- [Groq API Documentation](https://console.groq.com/docs/api-reference)
- [Gemini API Documentation](https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/gemini)
- [MobX-State-Tree Documentation](https://mobx-state-tree.js.org/)