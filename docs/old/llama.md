# Llama Integration

This document outlines the Llama integration in the Onyx mobile app.

## Overview

The Llama integration provides local language model capabilities using llama.cpp through React Native bindings. The implementation is split across several components and services for better maintainability and separation of concerns.

## Directory Structure

```
app/
├── components/chat/           # Chat UI components
│   ├── ChatBubble.tsx       # Chat bubble rendering
│   ├── ChatContainer.tsx    # Main chat container
│   └── ChatTheme.ts        # Chat UI theming
├── services/llama/          # Llama integration services
│   ├── LlamaTypes.ts       # Type definitions
│   ├── LlamaContext.ts     # Context management
│   ├── LlamaCommands.ts    # Command handling
│   └── LlamaFileUtils.ts   # File utilities
└── screens/
    └── LlamaRNExample.tsx  # Main screen component
```

## Components

### ChatContainer

The main component that handles:
- Chat UI rendering
- Message management
- Context initialization
- Command processing
- Model interaction

### ChatBubble

Handles the rendering of individual chat messages with support for:
- System messages
- User messages
- Assistant messages
- Metadata display (timings, etc.)

### ChatTheme

Defines the visual styling for the chat interface including:
- Colors
- Typography
- Spacing
- Input styling

## Services

### LlamaContext

Manages the Llama model context:
- Model initialization
- Context lifecycle
- Model information
- Performance metrics

### LlamaCommands

Handles chat commands:
- /info - Display model information
- /bench - Run model benchmarks
- /release - Release model context
- /stop - Stop current completion
- /reset - Reset conversation
- /save-session - Save session tokens
- /load-session - Load session tokens
- /lora - Load LoRA adapter
- /remove-lora - Remove LoRA adapter
- /lora-list - List loaded LoRA adapters

### LlamaFileUtils

Handles file operations:
- Model file picking
- LoRA file picking
- File copying for Android compatibility
- Internal storage management

## Types

Key type definitions in LlamaTypes.ts:

\`\`\`typescript
interface LlamaContext {
  id: string
  gpu: boolean
  reasonNoGPU: string
  model: {
    isChatTemplateSupported: boolean
  }
  // ... methods
}

interface ChatMessage extends MessageType.Text {
  metadata?: {
    system?: boolean
    copyable?: boolean
    contextId?: string
    conversationId?: string
    timings?: string
  }
}
\`\`\`

## Usage

### Loading a Model

1. Tap the attachment button in the chat interface
2. Select a GGUF model file
3. Wait for initialization
4. Start chatting

### Using Commands

Type any of the following commands in the chat input:

- `/info` - View model information
- `/bench` - Run benchmarks
- `/release` - Release the model
- `/stop` - Stop generation
- `/reset` - Reset chat
- `/save-session` - Save session
- `/load-session` - Load session
- `/lora` - Load LoRA
- `/remove-lora` - Remove LoRA
- `/lora-list` - List LoRAs

### Model Parameters

Default completion parameters:

\`\`\`typescript
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
    '</s>',
    '<|end|>',
    '<|im_end|>',
    '<|EOT|>',
    '<|end_of_turn|>',
    '<|endoftext|>',
  ]
}
\`\`\`

## Platform Specifics

### iOS
- GPU acceleration enabled by default (n_gpu_layers: 99)
- Uses 'public.data' for file picking

### Android
- GPU acceleration disabled (n_gpu_layers: 0)
- Uses 'application/octet-stream' for file picking
- Requires file copying to internal storage

## Performance

The integration includes performance monitoring:
- Load time tracking
- Token generation speed
- Memory usage tracking
- GPU utilization status

## Error Handling

The integration handles various error cases:
- Model loading failures
- Context initialization errors
- Completion errors
- File system errors
- LoRA loading errors

## Future Improvements

Planned enhancements:
1. Multiple LoRA adapter support
2. Better GPU layer configuration
3. Custom model parameter UI
4. Session management improvements
5. Enhanced error recovery
6. Performance optimizations