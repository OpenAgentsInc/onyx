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

### Download Screen
- Shows available models with sizes
- Displays current model files
- Download button with progress
- Error messages when issues occur
- Clear visual feedback for selected model

### Chat Screen
- Model switcher in top-right corner
- Chat interface with model commands
- Loading indicator during initialization
- Input disabled when no model loaded

### Visual States
- Download progress percentage
- Initialization progress
- Error messages with retry option
- Model file management
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
}
```

## Model Lifecycle

### Initial Load
1. Check for locally downloaded model
2. If found:
   - Validate file size (>100MB)
   - Initialize automatically
3. If not found or invalid:
   - Show model selector
   - Reset to idle state

### Model Download
1. User selects model
2. Shows download confirmation with:
   - Size warning
   - Background warning
   - Wi-Fi recommendation
3. Downloads with progress updates
4. Validates downloaded file:
   - Checks file exists
   - Verifies size
   - Validates model info
5. Automatically initializes after download

### Model Initialization
1. Release any existing context
2. Load and validate model info
3. Initialize Llama context
4. Show progress in UI
5. Display model info on success
6. Handle errors and allow retry

### Error Handling
- Download cancellation (app backgrounded)
- Initialization failures
- File validation errors
- Context release errors
- Network issues
- Storage issues

## Implementation Details

### Key Components
- `useModelStore`: Central state management
- `ModelDownloader`: Handles file downloads
- `useModelContext`: Manages model context
- `useModelInitialization`: Handles initialization flow
- `DownloadScreen`: Main download UI
- `ModelSelector`: Model selection UI
- `ModelFileManager`: File management UI
- `LoadingIndicator`: Initialization progress

### File Management
- Models stored in app cache directory
- Automatic cleanup on:
  - Download cancellation
  - Initialization failure
  - Model switching
- File validation before use
- Size verification (>100MB)
- Model info validation

### Best Practices
1. Always validate downloaded files
2. Handle app backgrounding gracefully
3. Show clear error messages
4. Allow error recovery
5. Clean up resources properly
6. Prevent invalid state transitions
7. Show clear progress indicators
8. Handle network issues gracefully

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

// Error handling example
try {
  await downloadModel()
} catch (e) {
  setError(e.message)
  // UI will show error and allow retry
}
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
- Minimum file size validation
- Model info validation
- Progress tracking for both download and initialization
- Clear error messages and recovery paths