# Initialization Architecture

## Current State

The app currently uses Zustand for:
- Router state management (useRouterStore)
- Onboarding state (useOnboardingStore)
- Both use AsyncStorage persistence

## Requirements

1. Expensive initialization operations:
   - BIP39 mnemonic generation
   - Storage initialization
   - Router state rehydration
   - Other crypto operations

2. Characteristics:
   - Some operations must be blocking
   - Some can run in background
   - Need singleton instances
   - Must be accessible throughout app

## Architecture Proposal

### 1. Core Services Layer

Create a services layer with singleton classes for core functionality:

```typescript
// src/services/CryptoService.ts
class CryptoService {
  private static instance: CryptoService
  private mnemonic: string | null = null
  
  private constructor() {}
  
  static getInstance(): CryptoService {
    if (!CryptoService.instance) {
      CryptoService.instance = new CryptoService()
    }
    return CryptoService.instance
  }

  async initialize(): Promise<void> {
    // Generate mnemonic etc
  }

  getMnemonic(): string | null {
    return this.mnemonic
  }
}

export default CryptoService.getInstance()
```

### 2. Initialization Store

Create a Zustand store to manage initialization state and coordinate services:

```typescript
// src/store/useInitStore.ts
import { create } from 'zustand'
import CryptoService from '../services/CryptoService'

interface InitState {
  isInitialized: boolean
  isInitializing: boolean
  error: Error | null
  initialize: () => Promise<void>
}

export const useInitStore = create<InitState>((set, get) => ({
  isInitialized: false,
  isInitializing: false,
  error: null,
  
  initialize: async () => {
    if (get().isInitializing || get().isInitialized) return
    
    set({ isInitializing: true })
    
    try {
      // Critical blocking operations
      await CryptoService.initialize()
      
      // Start background operations
      Promise.all([
        // Non-blocking operations
      ]).catch(console.error)
      
      set({ isInitialized: true })
    } catch (error) {
      set({ error: error as Error })
    } finally {
      set({ isInitializing: false })
    }
  }
}))
```

### 3. Initialization Guard Component

Create a component to manage initialization flow:

```typescript
// src/components/InitializationGuard.tsx
import { useEffect } from 'react'
import { useInitStore } from '../store/useInitStore'

export function InitializationGuard({ 
  children,
  fallback = null 
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode 
}) {
  const { initialize, isInitialized, isInitializing, error } = useInitStore()

  useEffect(() => {
    initialize()
  }, [])

  if (error) {
    return <div>Error initializing app: {error.message}</div>
  }

  if (isInitializing || !isInitialized) {
    return fallback
  }

  return children
}
```

### 4. Usage in App Root

Wrap the Router with the initialization guard:

```typescript
// src/App.tsx
import { InitializationGuard } from './components/InitializationGuard'
import Router from './navigation/Router'

export default function App() {
  return (
    <InitializationGuard
      fallback={<div>Initializing...</div>}
    >
      <Router />
    </InitializationGuard>
  )
}
```

## Benefits of This Approach

1. **Separation of Concerns**
   - Services handle core functionality
   - Store manages initialization state
   - Guard component handles UI flow

2. **Singleton Management**
   - Services are true singletons
   - Initialization happens once
   - State is accessible anywhere

3. **Flexible Initialization**
   - Can handle both blocking and background operations
   - Clear error handling
   - Progress tracking

4. **Type Safety**
   - Full TypeScript support
   - Clear interfaces
   - Predictable state

## Considerations

1. **Service Dependencies**
   - Services may need to be initialized in specific order
   - Consider using a dependency injection pattern for complex service relationships

2. **State Persistence**
   - Use Zustand's persist middleware for stores that need persistence
   - Services can use their own storage mechanisms

3. **Error Recovery**
   - Implement retry mechanisms for critical services
   - Consider offline-first approach

4. **Performance**
   - Lazy load non-critical services
   - Use web workers for heavy computations
   - Consider code splitting for initialization code

## Example Service Dependencies

```typescript
// src/services/ServiceManager.ts
class ServiceManager {
  private static instance: ServiceManager
  
  private constructor() {}
  
  static getInstance(): ServiceManager {
    if (!ServiceManager.instance) {
      ServiceManager.instance = new ServiceManager()
    }
    return ServiceManager.instance
  }

  async initializeServices(): Promise<void> {
    // Critical services first
    await CryptoService.initialize()
    
    // Then parallel initialization of non-critical services
    await Promise.all([
      StorageService.initialize(),
      NetworkService.initialize()
    ])
  }
}

export default ServiceManager.getInstance()
```

This architecture provides a solid foundation for managing complex initialization requirements while maintaining clean code organization and type safety.