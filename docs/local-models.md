# Local Model Management

The app supports downloading and managing multiple local LLM models. This document explains how the model management system works.

## Model Configuration

Models are configured in `src/screens/Chat/constants.ts`:

```typescript
export const AVAILABLE_MODELS: { [key: string]: ModelConfig } = {
  '3B': {
    repoId: 'hugging-quants/Llama-3.2-3B-Instruct-Q4_K_M-GGUF',
    filename: 'llama-3.2-3b-instruct-q4_k_m.gguf',
    displayName: 'Llama 3.2 3B Instruct'
  },
  '1B': {
    repoId: 'hugging-quants/Llama-3.2-1B-Instruct-Q4_K_M-GGUF',
    filename: 'llama-3.2-1b-instruct-q4_k_m.gguf',
    displayName: 'Llama 3.2 1B Instruct'
  }
}
```

## State Management

Model state is managed through a Zustand store (`src/store/useModelStore.ts`) with the following features:

- Model selection
- Download progress tracking
- Initialization state
- Error handling
- Persistent storage of selected model

### Model States

```typescript
type ModelStatus = 'idle' | 'downloading' | 'initializing' | 'ready' | 'error'
```

State transitions:
1. idle → downloading (when starting download)
2. downloading → initializing (when download completes)
3. initializing → ready (when model is loaded)
4. Any state → error (on failure)
5. Any state → idle (on reset/cancel)

## Model Initialization

The initialization process is handled by several components:

1. `useModelInitialization` hook:
   - Checks for locally downloaded models on app start
   - Prevents multiple simultaneous initializations
   - Manages initialization state

2. `useModelContext` hook:
   - Handles model context creation and release
   - Manages model initialization process
   - Provides context to chat interface

3. `ModelDownloader` class:
   - Handles downloading models from Hugging Face
   - Manages download progress
   - Handles app backgrounding during download

## Error Handling

The system handles several types of errors:

- Download failures (network issues, cancellation)
- Initialization failures (memory issues, corrupted files)
- App backgrounding during download
- Invalid model selections

## Usage in Components

Components can access model state through the store:

```typescript
const { 
  selectedModelKey,
  status,
  progress,
  errorMessage
} = useModelStore()
```

Available actions:
- `selectModel(modelKey)`: Switch to a different model
- `startDownload()`: Begin downloading selected model
- `cancelDownload()`: Cancel ongoing download
- `reset()`: Reset to initial state

## UI Components

The model management UI consists of:

- Model selector in app header
- Download progress indicator
- Error messages
- Initialization status

## Best Practices

1. Always check model status before operations
2. Handle app backgrounding gracefully
3. Clean up resources when switching models
4. Provide clear feedback during long operations
5. Persist user model preferences