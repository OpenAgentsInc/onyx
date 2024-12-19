# Project File Hierarchy

```
src/
├── app.tsx                     # Root app component with canvas and router
├── canvas/                     # Three.js canvas components
│   ├── Canvas.tsx              # Canvas and Orb
│   ├── index.ts                # Exports
│   └── types.ts                # Canvas types
├── components/                 # Shared UI components
│   ├── Badge.tsx               # Badge component for status indicators
│   ├── Button.tsx              # Common button component
│   ├── Card.tsx                # Card container component
│   ├── Checkbox.tsx            # Checkbox input component
│   ├── DataTable.tsx           # Table component for data display
│   ├── RadioButtonGroup.tsx    # Radio button group component
│   └── TextArea.tsx            # Text input component
├── navigation/                 # Navigation configuration
│   ├── Router.tsx              # Main router with navigation container
│   └── RouterWrapper.tsx       # Native wrapper for router initialization
├── screens/                    # Main app screens
│   └── Marketplace/            # Example of screen organization
│       ├── index.tsx           # Exports the wrapper
│       ├── Screen.tsx          # DOM/Web component ('use dom')
│       └── Wrapper.tsx         # Native wrapper with hooks/services
├── services/                   # Core services
│   ├── KeyService.ts           # Key management service
│   ├── ServiceManager.ts       # Service initialization orchestration
│   ├── secure-storage/         # Secure storage implementation
│   └── hooks/                  # Service-related hooks
├── store/                      # Zustand stores
│   └── useInitStore.ts         # Initialization state management
├── theme/                      # Theme configuration
│   ├── global.css              # Global styles and DOM defaults
│   └── typography.ts           # Font configuration
└── utils/                      # Utility functions
    └── crypto-polyfill.ts      # Crypto polyfills for web

Key Architectural Points:

## Native-Web Component Pattern
Each screen follows a three-file pattern:
- index.tsx: Exports the wrapper
- Screen.tsx: Pure DOM component with 'use dom'
- Wrapper.tsx: Native wrapper with hooks/services

## Component Responsibilities
- Wrapper Components (Native):
  - Handle native APIs (secure storage, etc.)
  - Manage service initialization
  - Pass data to DOM components via props
  - Handle native-specific functionality

- Screen Components (DOM/Web):
  - Pure presentation components
  - Use 'use dom' directive
  - Receive all data via props
  - No direct API/service access
  - Use DOM elements (div instead of View)

## Service Architecture
- ServiceManager: Orchestrates service initialization
- KeyService: Manages secure key operations
- Secure Storage: Handles encrypted storage
- Hooks: Provide service access to components

## Styling Strategy
- global.css: Enforces black backgrounds and base styles
- DOM components use className and inline styles
- Native components use React Native StyleSheet
- Consistent spacing and typography

## State Management
- useInitStore: Manages app initialization
- Zustand for state management
- Persistent storage where needed

## Navigation
- RouterWrapper: Handles initialization
- Router: Uses react-navigation
- Screen-specific wrappers for native functionality

## Best Practices
1. Always use wrapper pattern for screens
2. Keep DOM components pure
3. Handle native operations in wrappers
4. Use proper layering for canvas visibility
5. Maintain consistent styling approach
6. Follow explicit naming conventions
7. Document component responsibilities

## Common Gotchas
1. Using React Native components in 'use dom'
2. Mixing native and web styling
3. Improper layering with canvas
4. Missing native wrappers
5. Inconsistent background handling
```
