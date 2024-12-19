# Initialization Flow

## Entry Point (app.tsx)
```tsx
function App() {
  return (
    <View style={$container}>
      <StatusBar style="light" />
      <View style={$canvasContainer}>
        <Canvas />
      </View>
      <View style={$routerContainer}>
        <RouterWrapper />
      </View>
    </View>
  )
}
```
1. App renders Canvas and RouterWrapper
2. Canvas is positioned behind RouterWrapper (zIndex: 0)
3. RouterWrapper handles initialization state

## RouterWrapper (navigation/RouterWrapper.tsx)
```tsx
export default function RouterWrapper() {
  const { isInitialized, isInitializing, errorMessage } = useInitStore()
  const initialize = useInitStore(state => state.initialize)

  React.useEffect(() => {
    initialize().catch(console.error)
  }, [])

  return (
    <View style={$container}>
      <Router 
        isInitialized={isInitialized}
        isInitializing={isInitializing}
        errorMessage={errorMessage}
        onRetry={initialize}
      />
    </View>
  )
}
```
1. Gets initialization state from useInitStore
2. Triggers initialization on mount
3. Passes state to Router component

## InitStore (store/useInitStore.ts)
```tsx
export const useInitStore = create(
  persist(
    (set, get) => ({
      isInitialized: false,
      isInitializing: false,
      errorMessage: null,
      
      initialize: async () => {
        if (get().isInitializing) return
        set({ isInitializing: true })
        
        try {
          await serviceManager.initializeServices()
          set({ isInitialized: true })
        } catch (error) {
          set({ errorMessage: error.message })
          throw error
        } finally {
          set({ isInitializing: false })
        }
      }
    }),
    {
      name: 'onyx-init-store',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => async (state) => {
        // Re-initialize services after rehydration
        await serviceManager.initializeServices()
      }
    }
  )
)
```
1. Manages initialization state
2. Persists state in AsyncStorage
3. Handles rehydration by re-initializing services

## ServiceManager (services/ServiceManager.ts)
```tsx
class ServiceManagerImpl {
  async initializeServices(): Promise<void> {
    if (this.initializationPromise) {
      return this.initializationPromise
    }

    this.initializationPromise = (async () => {
      try {
        // Initialize KeyService first
        await keyService.initialize()
        
        // Get mnemonic from KeyService
        const mnemonic = await keyService.getMnemonic()
        
        // Initialize other services in parallel
        await Promise.all([
          breezService.initialize({ mnemonic }),
          nostrService.initialize()
        ])

        this.isInitialized = true
      } finally {
        this.initializationPromise = null
      }
    })()

    return this.initializationPromise
  }
}
```
1. Orchestrates service initialization
2. Initializes KeyService first
3. Gets mnemonic from KeyService
4. Initializes other services in parallel

## KeyService (services/KeyService.ts)
```tsx
class KeyServiceImpl {
  async initialize(): Promise<void> {
    if (this.initializationPromise) {
      return this.initializationPromise
    }

    this.initializationPromise = (async () => {
      try {
        // Try to load existing mnemonic
        let mnemonic = await secureStorage.getMnemonic()
        
        // Generate new if none exists
        if (!mnemonic) {
          mnemonic = generateMnemonic(wordlist)
        }
        
        // Validate and store
        if (!validateMnemonic(mnemonic, wordlist)) {
          throw new Error('Invalid mnemonic')
        }
        
        await secureStorage.setMnemonic(mnemonic)
        this.mnemonic = mnemonic
        this.isInitializedFlag = true
      } finally {
        this.initializationPromise = null
      }
    })()

    return this.initializationPromise
  }
}
```
1. Checks for existing mnemonic in secure storage
2. Generates new mnemonic if none exists
3. Validates mnemonic
4. Stores mnemonic securely

## SecureStorage (services/secure-storage/index.ts)
```tsx
export const secureStorage = {
  getMnemonic: async () => {
    try {
      return await SecureStore.getItemAsync('mnemonic')
    } catch (error) {
      console.error('SecureStorage: Error getting mnemonic:', error)
      throw error
    }
  },
  
  setMnemonic: async (value: string) => {
    try {
      await SecureStore.setItemAsync('mnemonic', value)
    } catch (error) {
      console.error('SecureStorage: Error setting mnemonic:', error)
      throw error
    }
  }
}
```
1. Provides secure storage interface
2. Uses expo-secure-store for native storage
3. Handles mnemonic storage operations

## Router (navigation/Router.tsx)
```tsx
export default function Router({ 
  isInitialized,
  isInitializing,
  errorMessage,
  onRetry
}: RouterProps) {
  if (errorMessage) {
    return <ErrorScreen message={errorMessage} onRetry={onRetry} />
  }

  if (isInitializing || !isInitialized) {
    return <LoadingScreen />
  }

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator>
        <Stack.Screen name="Marketplace" component={Marketplace} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
```
1. Shows error screen if initialization failed
2. Shows loading screen during initialization
3. Renders navigation stack when initialized

## Initialization States

### Initial Load
1. App renders with black background
2. Canvas renders in background
3. RouterWrapper mounts and triggers initialization
4. Loading screen shows during initialization
5. Services initialize in sequence
6. Navigation stack renders when complete

### Error State
1. Error during initialization
2. Error screen shows with retry button
3. Retry triggers initialization again
4. Loading screen shows during retry

### Rehydration
1. App loads with persisted state
2. Services re-initialize
3. State updates based on initialization result

## Common Initialization Issues
1. Secure storage access failures
2. Invalid mnemonic format
3. Network errors in service initialization
4. Rehydration state conflicts
5. Multiple initialization attempts

## Best Practices
1. Always check isInitializing before starting
2. Handle all error cases explicitly
3. Provide retry mechanism
4. Log initialization steps
5. Maintain initialization sequence
6. Handle rehydration properly
7. Clean up initialization promises