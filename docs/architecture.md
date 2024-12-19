# Onyx Architecture

## Native-Web Component Pattern

Onyx uses a specific pattern for handling native functionality in a React Native Web environment. This document explains the architecture and patterns used.

### Core Principles

1. Native operations (secure storage, crypto, etc.) should only happen in native components
2. Web/DOM components should receive data via props
3. Use wrapper components to bridge native and web

### Component Pattern

For components that need native functionality:

```
src/
  screens/
    ExampleScreen/
      index.tsx        # Exports the wrapper by default
      Wrapper.tsx      # Native wrapper component
      Screen.tsx       # Web/DOM component
```

Example implementation:

```typescript
// Wrapper.tsx (Native)
import React from 'react'
import { useNativeFeature } from '@/services/hooks/useNativeFeature'
import Screen from './Screen'

export default function ExampleWrapper() {
  const { data, isLoading, error } = useNativeFeature()
  
  return (
    <Screen 
      data={data}
      isLoading={isLoading}
      error={error}
    />
  )
}

// Screen.tsx (Web/DOM)
'use dom'
import React from 'react'

interface ScreenProps {
  data: any
  isLoading: boolean
  error: string | null
}

export default function Screen({ data, isLoading, error }: ScreenProps) {
  // Pure presentation logic
  return (...)
}
```

### Key Benefits

1. **Clean Separation of Concerns**
   - Native components handle native APIs
   - Web components focus on presentation
   - Clear data flow via props

2. **Better Error Handling**
   - Native errors caught in wrapper
   - Web component gets error state via props
   - No try/catch needed in web components

3. **Improved Testability**
   - Web components are pure functions
   - Native wrappers can be mocked
   - Clear interface between layers

### Example: MarketplaceScreen

The MarketplaceScreen implementation demonstrates this pattern:

```typescript
// MarketplaceScreenWrapper.tsx (Native)
import { useNostr } from '@/services/hooks/useNostr'
import MarketplaceScreen from './MarketplaceScreen'

export default function MarketplaceScreenWrapper() {
  const { npub, isLoading, error } = useNostr()
  return <MarketplaceScreen npub={npub} isLoading={isLoading} error={error} />
}

// MarketplaceScreen.tsx (Web/DOM)
'use dom'
interface MarketplaceScreenProps {
  npub: string | null
  isLoading: boolean
  error: string | null
}

export default function MarketplaceScreen({ npub, isLoading, error }: MarketplaceScreenProps) {
  // Pure presentation logic
}
```

### Best Practices

1. Always use wrapper components for:
   - Secure storage operations
   - Cryptographic operations
   - Native API access
   - Complex state management

2. Keep web components pure:
   - Accept all data via props
   - No direct API calls
   - No native dependencies

3. Use clear interfaces:
   - Define prop types explicitly
   - Document expected data shapes
   - Handle all possible states (loading, error, success)

4. Follow naming conventions:
   - `ComponentWrapper.tsx` for native wrappers
   - `Component.tsx` for web/DOM components
   - Use index.tsx to export the wrapper

### Testing

1. Web Components:
   - Test with standard React testing tools
   - Mock props for different states
   - Focus on presentation logic

2. Native Wrappers:
   - Mock native services
   - Test data transformation
   - Verify error handling

### Common Pitfalls

1. Accessing native APIs in web components
2. Mixing presentation and business logic
3. Incomplete error handling
4. Missing loading states
5. Tight coupling between layers

### Migration Guide

When converting existing components:

1. Split into wrapper/presentation components
2. Move native code to wrapper
3. Define clear props interface
4. Update imports to use wrapper
5. Add proper error handling
6. Add loading states