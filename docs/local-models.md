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

## User Interface

### Initial State
- Shows model selector with available models and their sizes
- Download button at bottom
- Clear visual feedback for selected model

### Active State
- Model switcher in top-right corner
- Shows current model status via icon:
  - chip: ready
  - download: downloading
  - cog-sync: initializing
  - cog-refresh: releasing
  - alert: error

## State Management

Model state is managed through a Zustand store (`src/store/useModelStore.ts`) with the following features:

### Model States
```typescript
type ModelStatus = 'idle' | 'downloading' | 'initializing' | 'ready' | 'error' | 'releasing'
```

State transitions:
1. idle → downloading (when starting download)
2. downloading → initializing (when download completes)
3. initializing → ready (when model is loaded)
4. ready → releasing (when switching models)
5. releasing → idle (after cleanup)
6. Any state → error (on failure)

### Store State
```typescript
interface ModelState {
  selectedModelKey: string      // Current selected model
  status: ModelStatus          // Current state
  progress: number            // Download progress (0-100)
  modelPath: string | null    // Path to downloaded model file
  errorMessage: string | null // Error message if any
  needsInitialization: boolean // Whether model needs to be initialized
}
```

## Model Lifecycle

### Initial Load
1. Check for locally downloaded model
2. If found, initialize automatically
3. If not found, show model selector

### Model Download
1. User selects model
2. Shows download confirmation with warnings
3. Downloads with progress updates
4. Validates downloaded file
5. Automatically initializes after download

### Model Switching
1. User clicks model switcher
2. Selects new model
3. Current model is released
4. If new model exists locally:
   - Initialize automatically
5. If new model not found:
   - Show download UI

### Error Handling
- Download cancellation (app backgrounded)
- Initialization failures
- File validation
- Context release errors

## Implementation Details

### Key Components
- `useModelStore`: Central state management
- `ModelDownloader`: Handles file downloads
- `useModelContext`: Manages model context
- `useModelInitialization`: Handles initialization flow
- `ModelSelector`: UI for model selection
- `ModelSwitcher`: UI for switching models

### File Management
- Models stored in app cache directory
- Cleaned up on download cancellation
- Validated before initialization
- Proper cleanup on model switch

### Best Practices
1. Always release context before switching models
2. Validate downloaded files
3. Handle app backgrounding gracefully
4. Show clear status indicators
5. Prevent actions during state transitions

## Usage Example

```typescript
const { 
  selectedModelKey,  // Current model key
  status,           // Current state
  progress,         // Download progress
  selectModel,      // Switch models
  startDownload,    // Begin download
  setReady         // Mark as ready
} = useModelStore()
```

## Download Sizes
- 1B model: ~1GB
- 3B model: ~2GB

## Technical Notes
- Uses react-native-blob-util for downloads
- Supports background download on iOS
- Handles app state changes
- Validates file integrity
- Proper error propagation
- State persistence between app launches