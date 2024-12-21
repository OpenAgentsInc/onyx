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

## Model Sizes
- 1B model: ~770 MB
- 3B model: ~1.9 GB

## User Interface

### Model Manager
- Shows all available models with:
  - Model name and size
  - Download/Delete button
  - Checkmark for active model
  - Actual file size when downloaded
- Allows selecting downloaded models
- Allows deleting individual models
- Accessed via "Models" button in chat

### Chat Screen
- Shows loading indicator during initialization
- Models button in top-right corner
- Chat interface with model commands
- Input disabled when no model loaded

### Visual States
- Download progress percentage
- Initialization progress
- Error messages with retry option
- Clear state transitions

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
7. error → idle (on retry)

### Store State
```typescript
interface ModelState {
  selectedModelKey: string      // Current selected model
  status: ModelStatus          // Current state
  progress: number            // Download progress (0-100)
  modelPath: string | null    // Path to downloaded model file
  errorMessage: string | null // Error message if any
  downloadCancelled: boolean  // Whether download was cancelled
  needsInitialization: boolean // Whether model needs to be initialized
  initializationAttempts: number // Number of initialization attempts
}
```

## Model Lifecycle

### Initial Load
1. Show loading indicator
2. Check for locally downloaded model
3. If found:
   - Validate file size (>100MB)
   - Initialize automatically
4. If not found or invalid:
   - Show model selector
   - Reset to idle state

### Model Download
1. User selects model
2. Shows download confirmation with:
   - Size warning
   - Background warning
   - Wi-Fi recommendation
3. Downloads with progress updates using FileSystem.createDownloadResumable
4. Validates downloaded file:
   - Checks file exists
   - Verifies minimum size (100MB)
   - Validates model info
5. Automatically initializes after download

### Model Switching
1. User clicks model in manager
2. Current model is released (status: 'releasing')
3. Wait for release to complete
4. Initialize new model (status: 'initializing')
5. Set to ready when complete

### Error Handling
- Download cancellation (app backgrounded)
- Initialization failures (limited to 1 attempt)
- File validation errors
- Context release errors
- Network issues
- Storage issues
- Memory limit errors (suggests smaller model)

## Implementation Details

### Key Components
- `useModelStore`: Central state management
- `downloadModel`: Handles file downloads with progress
- `useModelContext`: Manages model context
- `useModelInitialization`: Handles initialization flow
- `ModelFileManager`: Model management UI
- `LoadingIndicator`: Initialization progress

### File Management
- Models stored in app cache directory
- Automatic cleanup on:
  - Download cancellation
  - Initialization failure
  - Model deletion
- File validation before use
- Size verification (>100MB)
- Model info validation
- Progress tracking during download

### Best Practices
1. Always validate downloaded files
2. Handle app backgrounding gracefully
3. Show clear error messages
4. Allow error recovery
5. Clean up resources properly
6. Prevent invalid state transitions
7. Show clear progress indicators
8. Handle network issues gracefully
9. Limit initialization attempts
10. Provide clear memory error messages

## Usage Example

```typescript
const { 
  selectedModelKey,  // Current model key
  status,           // Current state
  progress,         // Download progress
  errorMessage,     // Current error if any
  selectModel,      // Switch models
  startDownload,    // Begin download
  setError,         // Set error state
  reset            // Reset to idle state
} = useModelStore()

// Download with progress example
try {
  await downloadModel(repoId, filename, (progress) => {
    console.log(`Download progress: ${progress}%`)
  })
} catch (e) {
  setError(e.message)
  // UI will show error and allow retry
}
```

## Technical Notes
- Uses expo-file-system for downloads
- Supports download progress tracking
- Handles app state changes
- Validates file integrity
- Proper error propagation
- State persistence between app launches
- Minimum file size validation (100MB)
- Model info validation
- Progress tracking for both download and initialization
- Clear error messages and recovery paths
- Proper cleanup of resources
- Safe model switching with release handling
- Uses temporary files during download
- Verifies file moves and copies
- Limits initialization attempts to prevent loops
- Memory-aware initialization with clear error messages