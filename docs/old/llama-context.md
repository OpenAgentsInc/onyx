# Llama Context Management

## Current Issue
The Llama context is being lost between voice recordings, requiring reinitialization. Symptoms:
1. Voice recording works and transcribes successfully
2. After transcription, system attempts to use Llama context
3. Context is missing, triggering reinitialization
4. Model has to be reloaded, causing delay

## Architecture Overview

### Key Components

1. **LlamaModelManager** (`app/services/llama/LlamaModelManager.ts`)
   - Singleton instance managing model lifecycle
   - Handles model downloading and caching
   - Manages context instance
   - Properties:
     ```typescript
     private currentContext: any = null
     private isReleasing = false
     private releasePromise: Promise<void> | null = null
     private lastUsedTimestamp: number = 0
     ```

2. **ModelStore** (`app/models/ModelStore.ts`)
   - MobX store for model state
   - Tracks loading states and errors
   - Stores context reference
   - Properties:
     ```typescript
     .volatile(() => ({
       _context: null as LlamaContext | null,
     }))
     ```

3. **LlamaContext** (`app/services/llama/LlamaContext.ts`)
   - Handles context initialization and release
   - Provides utility functions
   - Key functions:
     ```typescript
     export const initializeLlamaContext = async (
       file: DocumentPickerResponse,
       loraFile: DocumentPickerResponse | null,
       onProgress: (progress: number) => void
     ): Promise<LlamaContext>

     export const handleContextRelease = async (
       context: LlamaContext | null,
       onRelease: () => void,
       onError: (error: any) => void
     )
     ```

4. **useLlamaVercelChat** (`app/hooks/useLlamaVercelChat.ts`)
   - React hook for chat functionality
   - Manages context initialization
   - Handles message processing
   - Key state:
     ```typescript
     const [inferencing, setInferencing] = useState(false)
     const [isInitializing, setIsInitializing] = useState(false)
     const hasInitializedRef = useRef(false)
     ```

### Context Flow

1. **Initialization**
   ```mermaid
   graph TD
     A[App Mount] --> B{Context Exists?}
     B -->|No| C[initializeModel]
     C --> D[Download Model]
     D --> E[Initialize Context]
     E --> F[Set in ModelStore]
     F --> G[Set in ModelManager]
     B -->|Yes| H[Use Existing]
   ```

2. **Voice Recording Flow**
   ```mermaid
   graph TD
     A[Record Audio] --> B[Stop Recording]
     B --> C[Transcribe]
     C --> D[Get Context]
     D -->|Context Missing| E[Reinitialize]
     D -->|Context Exists| F[Process Message]
   ```

3. **Context Cleanup**
   ```mermaid
   graph TD
     A[Component Unmount] --> B[Release Context]
     B --> C[Clear ModelStore]
     C --> D[Clear ModelManager]
   ```

## Potential Issues

1. **Context Release Timing**
   - Context might be released too aggressively
   - Multiple components requesting release
   - Cleanup on unmount vs cleanup on timeout

2. **State Synchronization**
   - ModelStore and ModelManager might get out of sync
   - Context reference could be lost between components
   - Volatile state in ModelStore doesn't persist

3. **Initialization Race Conditions**
   - Multiple components requesting initialization
   - Concurrent initialization attempts
   - Incomplete initialization cleanup

4. **Memory Management**
   - Context not properly released
   - Memory leaks from unreleased contexts
   - Multiple contexts created accidentally

## Debug Points

1. **Context State Tracking**
   Add logging to track context lifecycle:
   ```typescript
   setContext(context: any) {
     console.log("[ModelManager] Setting context:", !!context)
     console.log("[ModelManager] Previous context:", !!this.currentContext)
     this.currentContext = context
   }
   ```

2. **Component Mounting**
   Track when components mount/unmount:
   ```typescript
   useEffect(() => {
     console.log("[Component] Mounted")
     return () => console.log("[Component] Unmounted")
   }, [])
   ```

3. **Context Usage**
   Log context access attempts:
   ```typescript
   getContext(): any {
     console.log("[ModelManager] Getting context:", !!this.currentContext)
     return this.currentContext
   }
   ```

4. **Initialization Flow**
   Track initialization steps:
   ```typescript
   const initializeModel = async () => {
     console.log("[Initialize] Starting")
     // ... initialization code ...
     console.log("[Initialize] Complete")
   }
   ```

## Investigation Steps

1. **Context Persistence**
   - Check if context is actually being released
   - Verify context references match between stores
   - Monitor context state during voice recording

2. **Component Lifecycle**
   - Track when components mount/unmount
   - Monitor context initialization triggers
   - Check cleanup timing

3. **Memory Usage**
   - Profile memory during operation
   - Check for multiple context instances
   - Monitor context release completion

4. **State Management**
   - Verify MobX store updates
   - Check ModelManager singleton state
   - Monitor context reference sharing

## Possible Solutions

1. **Strict Context Lifecycle**
   ```typescript
   class LlamaModelManager {
     private contextState: {
       instance: any;
       lastUsed: number;
       isReleasing: boolean;
     } | null = null;
   }
   ```

2. **Reference Counting**
   ```typescript
   class LlamaModelManager {
     private contextUsers = new Set<string>();
     
     addContextUser(id: string) {
       this.contextUsers.add(id);
     }
     
     removeContextUser(id: string) {
       this.contextUsers.delete(id);
       if (this.contextUsers.size === 0) {
         this.scheduleRelease();
       }
     }
   }
   ```

3. **Context Provider Pattern**
   ```typescript
   const LlamaContext = React.createContext<LlamaContextType | null>(null);
   
   export function LlamaProvider({ children }: { children: React.ReactNode }) {
     const contextValue = useLlamaVercelChat();
     return (
       <LlamaContext.Provider value={contextValue}>
         {children}
       </LlamaContext.Provider>
     );
   }
   ```

4. **Persistent Context**
   ```typescript
   class LlamaModelManager {
     private persistContext() {
       if (!this.currentContext) return;
       // Store context state
       AsyncStorage.setItem('llamaContext', JSON.stringify({
         timestamp: Date.now(),
         state: this.currentContext.getState()
       }));
     }
     
     private async restoreContext() {
       const stored = await AsyncStorage.getItem('llamaContext');
       if (!stored) return;
       // Restore context state
     }
   }
   ```

## Next Steps

1. Add comprehensive logging to track context lifecycle
2. Monitor memory usage during voice recording flow
3. Verify context initialization and release timing
4. Test different context persistence strategies
5. Implement proper cleanup and initialization synchronization

## Related Issues

- Context limit reached errors
- Model reinitialization delays
- Memory usage growth
- Voice recording interruptions