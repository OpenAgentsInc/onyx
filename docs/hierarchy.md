# Project Structure

This document outlines the complete file and folder hierarchy of the Onyx mobile app project.

## Root Structure

```
onyx/
├── app/                      # Main application code
├── assets/                   # Static assets
│   ├── icons/               # Icon assets
│   └── images/              # Image assets
├── docs/                    # Documentation
│   ├── hierarchy.md        # Project structure documentation
│   ├── websockets.md       # WebSocket implementation docs
│   ├── llama.md           # Llama integration docs
│   └── mcp/               # Model Context Protocol docs
├── test/                    # Test configurations and mocks
├── android/                 # Android-specific native code
├── ios/                     # iOS-specific native code
├── ignite/                  # Ignite CLI templates
└── index.js                 # Application entry point
```

## App Directory Structure

```
app/
├── app.tsx                  # Main App component
├── components/              # Reusable UI components
│   ├── AutoImage.tsx       # Image component with auto-sizing
│   ├── Button.tsx          # Custom button component
│   ├── Card.tsx           # Card container component
│   ├── EmptyState.tsx     # Empty state display component
│   ├── Header.tsx         # Header component
│   ├── Icon.tsx           # Icon component
│   ├── ListItem.tsx       # List item component
│   ├── ListView.tsx       # List view component
│   ├── NexusOverlay.tsx   # WebSocket connection status overlay
│   ├── Screen.tsx         # Screen container component
│   ├── Text.tsx           # Text component
│   ├── TextField.tsx      # Text input component
│   ├── Toggle/            # Toggle components
│   │   ├── Checkbox.tsx   # Checkbox component
│   │   ├── Radio.tsx     # Radio button component
│   │   └── Toggle.tsx    # Base toggle component
│   ├── chat/              # Chat components
│   │   ├── ChatBubble.tsx # Chat bubble rendering
│   │   ├── ChatContainer.tsx # Main chat container
│   │   └── ChatTheme.ts  # Chat UI theming
│   ├── VectorIcon.tsx     # Vector icon component
│   └── index.ts           # Components barrel file
├── config/                 # App configuration
│   ├── env.ts            # Environment configuration
│   └── websocket.ts       # WebSocket configuration
├── devtools/              # Development tools
├── i18n/                  # Internationalization
├── models/                # MobX state tree models
├── navigators/            # Navigation configuration
│   ├── AppNavigator.tsx   # Main app navigator
│   ├── DemoNavigator.tsx  # Demo screens navigator
│   └── MainNavigator.tsx  # Main tab navigator
├── screens/               # Screen components
│   ├── ChatScreen.tsx     # Chat interface screen with WebSocket
│   ├── CommunityScreen.tsx # Community tab screen
│   ├── ErrorScreen/       # Error handling screens
│   │   └── ErrorBoundary.tsx # Error boundary component
│   ├── HomeScreen.tsx     # Home tab screen
│   ├── LoginScreen.tsx    # Login screen
│   ├── OnyxScreen.tsx     # Main Onyx interface
│   ├── ProfileScreen.tsx  # Profile tab screen
│   ├── UpdaterScreen.tsx  # App updater screen
│   ├── WalletScreen.tsx   # Wallet tab screen
│   ├── WelcomeScreen.tsx  # Welcome/onboarding screen
│   └── index.ts          # Screens barrel file
├── services/              # External services and APIs
│   ├── api/              # REST API services
│   ├── llama/            # Llama integration services
│   │   ├── LlamaTypes.ts # Type definitions
│   │   ├── LlamaContext.ts # Context management
│   │   ├── LlamaCommands.ts # Command handling
│   │   └── LlamaFileUtils.ts # File utilities
│   ├── mcp/              # Model Context Protocol services
│   │   ├── client/       # MCP client implementation
│   │   │   ├── OnyxMCPClient.ts
│   │   │   ├── types.ts
│   │   │   └── errors.ts
│   │   ├── transport/    # Transport layer
│   │   │   ├── WebSocketTransport.ts
│   │   │   ├── ConnectionManager.ts
│   │   │   └── types.ts
│   │   ├── cache/        # Caching layer
│   │   │   ├── ResourceCache.ts
│   │   │   └── types.ts
│   │   ├── storage/      # Persistent storage
│   │   │   ├── AsyncStorage.ts
│   │   │   └── types.ts
│   │   ├── sync/         # Background sync
│   │   │   ├── BackgroundSync.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   ├── offline/      # Offline support
│   │   │   ├── OfflineManager.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   ├── network/      # Network optimization
│   │   │   ├── NetworkOptimizer.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   ├── hooks/        # React hooks
│   │   │   ├── useMCPClient.ts
│   │   │   └── useMCPResource.ts
│   │   └── index.ts      # MCP barrel file
│   ├── websocket/        # WebSocket services
│   │   ├── WebSocketService.ts  # Core WebSocket functionality
│   │   ├── types.ts            # WebSocket type definitions
│   │   ├── useWebSocket.ts     # React hook for WebSocket
│   │   └── index.ts           # WebSocket barrel file
│   └── index.ts          # Services barrel file
├── theme/                # Styling and theming
├── types/                # Global type definitions
│   └── websocket.ts     # WebSocket type definitions
└── utils/                # Utility functions
```

## Assets Directory Structure

```
assets/
├── icons/                # Icon assets (.png)
│   ├── back.png
│   ├── bell.png
│   ├── check.png
│   └── ...
└── images/              # Image assets (.png, .jpg, .gif)
```

## Documentation Structure

```
docs/
├── hierarchy.md         # Project structure documentation
├── websockets.md        # WebSocket implementation details
├── llama.md            # Llama integration documentation
└── mcp/                # Model Context Protocol documentation
    ├── README.md       # MCP overview
    ├── architecture.md # Architecture documentation
    ├── implementation-plan.md # Implementation plan
    ├── implementation-log.md # Implementation progress log
    ├── onyx_strategy.md # Onyx integration strategy
    ├── roots.md        # Root concepts
    ├── sampling.md     # Sampling documentation
    ├── spec_summary.md # Specification summary
    └── typescript-sdk.md # TypeScript SDK documentation
```

## Key Directories and Their Purposes

### app/components
Contains reusable UI components that are used across different screens. Each component is typically self-contained with its own styles and logic.

### app/components/chat
Contains chat-specific components for the Llama integration:
- Chat UI components
- Message rendering
- Theme configuration

### app/navigators
Contains navigation configuration using React Navigation. Defines the app's navigation structure and screen hierarchy.

### app/screens
Contains the main screen components. Each screen represents a full-page view in the application.

### app/services
Contains service integrations, API clients, and other external service interfaces.

#### app/services/llama
Contains Llama integration files:
- Type definitions
- Context management
- Command handling
- File utilities

#### app/services/mcp
Contains Model Context Protocol implementation:
- Client implementation
- Transport layer
- Caching system
- Persistent storage
- Background sync
- Offline support
- Network optimization
- React hooks

#### app/services/websocket
Contains WebSocket implementation files:
- Core WebSocket functionality
- TypeScript interfaces and types
- React hook for WebSocket usage
- Barrel file for WebSocket exports

### app/config
Contains configuration files including WebSocket settings and environment variables.

### app/theme
Contains theming configuration including colors, typography, and spacing.

### app/utils
Contains utility functions and helpers used throughout the application.

### app/models
Contains MobX State Tree models for state management.

### app/i18n
Contains internationalization configuration and translation files.

## Development Tools and Configuration

### test/
Contains Jest test configuration and mocks for testing.

### ignite/
Contains Ignite CLI templates for generating new components, screens, and other boilerplate code.

### android/ & ios/
Contains native code and configurations for each platform.

This structure follows the Ignite boilerplate conventions while incorporating custom additions for the Onyx project. The organization emphasizes modularity, reusability, and clear separation of concerns.