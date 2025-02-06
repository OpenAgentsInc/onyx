# Hyperview in Onyx

Onyx uses [Hyperview](https://hyperview.org) as its primary UI system, allowing the app to be driven by server-side HXML content. This enables rapid UI updates without app store submissions.

## Architecture

Instead of using React Navigation, Onyx uses Hyperview as its main navigation and UI system. The server delivers HXML that defines:
- Screen layouts
- Navigation flows
- Behaviors and interactions
- Styling

## Server Integration

The app connects to the OpenAgents backend at:
```typescript
`${config.api.url}/hyperview`
```

This endpoint serves HXML content that defines the entire app interface.

## Directory Structure

```
app/hyperview/
├── behaviors/     - Custom HXML behaviors
├── components/    - Custom HXML components
└── helpers/       - Utility functions
    ├── logger.ts  - Logging functionality
    └── fetch.ts   - Network request wrapper
```

## Main App Integration

The Hyperview client is integrated at the root level in `app/app.tsx`:

```typescript
<SafeAreaProvider initialMetrics={initialWindowMetrics}>
  <ErrorBoundary catchErrors={Config.catchErrors}>
    <KeyboardProvider>
      <View style={{ flex: 1 }}>
        <Hyperview
          behaviors={behaviors}
          components={components}
          entrypointUrl={`${config.api.url}/hyperview`}
          fetch={fetchWrapper}
          formatDate={(date, format) => date?.toLocaleDateString()}
          logger={new Logger(Logger.Level.log)}
        />
      </View>
    </KeyboardProvider>
  </ErrorBoundary>
</SafeAreaProvider>
```

## Custom Components

Custom components can be added in `app/hyperview/components/`:

```typescript
// app/hyperview/components/MyComponent.tsx
export const MyComponent = (props) => {
  // Component implementation
}

// app/hyperview/components/index.ts
import { MyComponent } from './MyComponent'

export default {
  'my-component': MyComponent
}
```

Then use in HXML:
```xml
<my-component prop="value">
  <text>Content</text>
</my-component>
```

## Custom Behaviors

Custom behaviors can be added in `app/hyperview/behaviors/`:

```typescript
// app/hyperview/behaviors/myBehavior.ts
export const myBehavior = (element, context) => {
  // Behavior implementation
}

// app/hyperview/behaviors/index.ts
import { myBehavior } from './myBehavior'

export default {
  'my-behavior': myBehavior
}
```

Then use in HXML:
```xml
<view my-behavior="value">
  <text>Content</text>
</view>
```

## Network Requests

The `fetchWrapper` in `app/hyperview/helpers/fetch.ts` handles all HXML requests. It:
- Adds default headers
- Handles CORS
- Can be extended for auth, caching, etc.

## Logging

The `Logger` class in `app/hyperview/helpers/logger.ts` provides consistent logging:
```typescript
const logger = new Logger(Logger.Level.log)
logger.info('Message')
logger.error('Error occurred', error)
```

## Development Workflow

1. Server team updates HXML endpoints
2. Client automatically gets new UI/flows
3. For new features:
   - Add custom components if needed
   - Add custom behaviors if needed
   - Update documentation

## Resources

- [Hyperview Documentation](https://hyperview.org/docs/guide_introduction)
- [HXML Reference](https://hyperview.org/docs/reference_index)
- [Example Apps](https://hyperview.org/docs/example_index)

## Future Improvements

1. Add offline support
   - Cache HXML responses
   - Queue behavior actions
2. Add error handling
   - Offline fallbacks
   - Retry logic
3. Add analytics
   - Screen views
   - Behavior tracking
4. Add testing
   - Component tests
   - Behavior tests
   - Integration tests