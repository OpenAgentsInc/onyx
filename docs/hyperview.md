# Hyperview Integration

Onyx uses [Hyperview](https://hyperview.org) to render server-driven UI from the OpenAgents backend. This allows us to update parts of the app's UI and behavior by deploying backend changes, without requiring app store updates.

## Overview

Hyperview consists of two main parts:
1. Server-side HXML generation (openagents repo)
2. Client-side HXML rendering (this repo)

The app fetches and renders HXML content from the server to create dynamic UI screens.

## Directory Structure

```
app/hyperview/
├── behaviors/     - Custom HXML behaviors
├── components/    - Custom HXML components
└── helpers/       - Utility functions
    ├── logger.ts  - Logging functionality
    └── fetch.ts   - Network request wrapper
```

## Screen Component

The main Hyperview screen component is in `app/screens/HyperviewScreen/`. This component:
1. Configures the Hyperview client
2. Connects to the backend
3. Renders HXML content

## Configuration

The Hyperview client is configured with:
- Entry point URL from config.api.url
- Custom behaviors and components
- Fetch wrapper for network requests
- Logger for debugging
- Date formatting function

## Adding Custom Components

1. Create component in `app/hyperview/components/`:
```typescript
export const MyComponent = (props) => {
  // Component implementation
}
```

2. Register in `app/hyperview/components/index.ts`:
```typescript
import { MyComponent } from './MyComponent'

export default {
  'my-component': MyComponent
}
```

## Adding Custom Behaviors

1. Create behavior in `app/hyperview/behaviors/`:
```typescript
export const myBehavior = (element, context) => {
  // Behavior implementation
}
```

2. Register in `app/hyperview/behaviors/index.ts`:
```typescript
import { myBehavior } from './myBehavior'

export default {
  'my-behavior': myBehavior
}
```

## Resources

- [Hyperview Documentation](https://hyperview.org/docs/guide_introduction)
- [HXML Reference](https://hyperview.org/docs/reference_index)
- [Example Apps](https://hyperview.org/docs/example_index)

## Future Improvements

1. Add error boundaries
2. Add loading states
3. Add offline support
4. Add caching
5. Add analytics/logging
6. Add testing infrastructure