# LLM Store Documentation

The LLM Store manages the state and lifecycle of local language models in the Onyx app. It uses MobX-State-Tree for state management and follows a modular architecture for better maintainability.

## Architecture

The store is organized into several modules:

```
src/models/llm/
├── actions/
│   ├── initialize.ts     # Initialization logic
│   └── model-management.ts # Model operations (download, delete, etc.)
├── types.ts             # Type definitions
├── views.ts            # Computed properties
├── store.ts           # Main store definition
└── index.ts          # Public exports
```

## Store State

The store maintains the following state:

```typescript
{
  isInitialized: boolean
  error: string | null
  models: ModelInfo[]
  selectedModelKey: string | null
}
```

### ModelInfo Structure

Each model in the store has the following properties:

```typescript
{
  key: string            // Unique identifier
  displayName: string    // Human-readable name
  path: string | null    // Local file path when downloaded
  status: ModelStatus    // Current state
  progress: number       // Download progress (0-100)
  error?: string        // Error message if any
}
```

### Model Status States

- `idle`: Initial state, model not downloaded
- `downloading`: Model is being downloaded
- `initializing`: Model is being loaded into memory
- `ready`: Model is downloaded and ready to use
- `error`: An error occurred

## Actions

### Initialization

```typescript
const store = createLLMStoreDefaultModel()
await store.initialize()
```

The initialize action:
1. Creates the models directory if needed
2. Scans for locally downloaded models
3. Updates store state with found models
4. Automatically selects a ready model if available

### Model Management

#### Download Model
```typescript
await store.startModelDownload("1B")
```
- Starts model download
- Updates progress in real-time
- Handles download errors
- Automatically selects model when ready if none selected

#### Cancel Download
```typescript
await store.cancelModelDownload("1B")
```
- Cancels ongoing download
- Cleans up temporary files
- Resets model status to idle

#### Delete Model
```typescript
await store.deleteModel("1B")
```
- Removes model file from disk
- Updates store state
- Clears selection if deleted model was selected

#### Select Model
```typescript
store.selectModel("1B")  // Select model
store.selectModel(null)  // Clear selection
```

## Views

### selectedModel
```typescript
const model = store.selectedModel
// Returns currently selected ModelInfo or null
```

### downloadingModel
```typescript
const downloading = store.downloadingModel
// Returns ModelInfo of downloading model or null
```

### hasReadyModel
```typescript
const hasModel = store.hasReadyModel
// Returns true if any model is in ready state
```

## Error Handling

The store maintains an error state that can be monitored:
```typescript
if (store.error) {
  console.error("Store error:", store.error)
}
```

Errors are set when:
- Initialization fails
- Download fails
- Model deletion fails
- File validation fails

## File Management

Models are stored in the app's cache directory:
```typescript
const MODELS_DIR = `${FileSystem.cacheDirectory}models`
```

File operations include:
- Download validation (size > 100MB)
- Temporary file cleanup
- Automatic background download cancellation
- Directory creation and maintenance

## Usage Example

```typescript
import { createLLMStoreDefaultModel } from "@/models/LLMStore"

// Create and initialize store
const store = createLLMStoreDefaultModel()
await store.initialize()

// Start model download
try {
  await store.startModelDownload("1B")
} catch (error) {
  console.error("Download failed:", error)
}

// Monitor download progress
reaction(
  () => store.downloadingModel?.progress,
  progress => {
    if (progress !== undefined) {
      console.log(`Download progress: ${progress}%`)
    }
  }
)

// Use selected model
const model = store.selectedModel
if (model?.status === "ready") {
  console.log(`Using model at ${model.path}`)
}
```

## Best Practices

1. Always initialize the store before use
2. Handle errors at the UI level
3. Monitor download progress for user feedback
4. Clean up resources when switching models
5. Validate model files after download
6. Handle app backgrounding gracefully
7. Provide clear error messages to users
8. Use TypeScript interfaces for type safety
9. Follow the modular architecture pattern
10. Document new features and changes