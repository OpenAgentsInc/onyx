# Project File Hierarchy

```
src/
├── app.tsx                     # Root app component with navigation
├── components/                 # Shared UI components
│   ├── Badge.tsx               # Badge component for status indicators
│   ├── Button.tsx              # Common button component
│   ├── Card.tsx                # Card container component
│   ├── Checkbox.tsx            # Checkbox input component
│   ├── DataTable.tsx           # Table component for data display
│   ├── RadioButtonGroup.tsx    # Radio button group component
│   └── TextArea.tsx            # Text input component
├── screens/                    # Main app screens
│   └── Chat/                   # Chat screen with model management
│       ├── components/         # Chat-specific components
│       │   ├── Bubble.tsx     # Chat bubble component
│       │   ├── DownloadScreen.tsx # Model download screen
│       │   ├── LoadingIndicator.tsx # Loading overlay
│       │   └── ModelFileManager.tsx # Model management modal
│       ├── hooks/             # Chat-specific hooks
│       │   ├── useChatHandlers.ts # Chat message handlers
│       │   ├── useModelContext.ts # Model context management
│       │   └── useModelInitialization.ts # Model initialization
│       ├── utils/             # Chat utilities
│       │   └── index.ts       # Message handling utilities
│       ├── constants.ts       # Model configurations
│       └── ChatContainer.tsx  # Main chat container
├── store/                      # Zustand stores
│   └── useModelStore.ts        # Model state management
├── theme/                      # Theme configuration
│   ├── chat.ts                # Chat-specific theme
│   ├── colors.ts              # Color palette
│   └── typography.ts          # Font configuration
└── utils/                      # Utility functions
    └── ModelDownloader.ts      # Model download handling

Key Architectural Points:

## Component Organization
- Screens contain their own components, hooks, and utils
- Shared components in root components directory
- Screen-specific components in screen directory

## Chat Screen Architecture
- ChatContainer: Main orchestrator
- Components:
  - ModelFileManager: Model management UI
  - LoadingIndicator: Initialization overlay
  - DownloadScreen: Initial model setup
  - Bubble: Chat message display
- Hooks:
  - useModelContext: Model context management
  - useModelInitialization: Model initialization
  - useChatHandlers: Message handling

## State Management
- useModelStore: Central model state
- Persistent storage for model paths
- Clear state transitions
- Error handling

## Model Management
- Model configuration in constants.ts
- Download handling in ModelDownloader
- File management in ModelFileManager
- Initialization in useModelInitialization

## Styling Strategy
- Theme-based styling
- Consistent color palette
- Typography configuration
- Component-specific styles

## Best Practices
1. Keep components focused and small
2. Use hooks for complex logic
3. Centralize state management
4. Handle errors gracefully
5. Follow consistent naming
6. Document component purposes
7. Use proper typing

## Common Patterns
1. Modal-based management UI
2. Loading indicator overlay
3. Error message display
4. Progress tracking
5. File system operations
6. State persistence

## Error Handling
1. Download failures
2. Initialization errors
3. File system issues
4. Network problems
5. Background app state
6. Model validation

## File Management
1. Cache directory usage
2. File validation
3. Cleanup operations
4. Size verification
5. Path management

## State Flow
1. Initial load → check files
2. Download → validate → initialize
3. Switch models → release → initialize
4. Error → cleanup → retry
```