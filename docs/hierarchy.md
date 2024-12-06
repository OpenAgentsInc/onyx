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
│   └── websockets.md       # WebSocket implementation docs
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
│   ├── Screen.tsx         # Screen container component
│   ├── Text.tsx           # Text component
│   ├── TextField.tsx      # Text input component
│   ├── Toggle/            # Toggle components
│   │   ├── Checkbox.tsx   # Checkbox component
│   │   ├── Radio.tsx     # Radio button component
│   │   └── Toggle.tsx    # Base toggle component
│   ├── VectorIcon.tsx     # Vector icon component
│   └── index.ts           # Components barrel file
├── config/                 # App configuration
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
│   ├── LoginScreen.tsx    # Login screen
│   ├── OnyxScreen.tsx     # Main Onyx interface
│   ├── PylonDemoScreen.tsx # Pylon demo screen
│   ├── WelcomeScreen.tsx  # Welcome/onboarding screen
│   └── index.ts          # Screens barrel file
├── services/              # External services and APIs
│   ├── api/              # REST API services
│   ├── websocket/        # WebSocket services
│   │   ├── WebSocketService.ts  # Core WebSocket functionality
│   │   ├── types.ts            # WebSocket type definitions
│   │   ├── useWebSocket.ts     # React hook for WebSocket
│   │   └── index.ts           # WebSocket barrel file
│   └── index.ts          # Services barrel file
├── theme/                # Styling and theming
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
└── ...                 # Other documentation files
```

## Key Directories and Their Purposes

### app/components
Contains reusable UI components that are used across different screens. Each component is typically self-contained with its own styles and logic.

### app/navigators
Contains navigation configuration using React Navigation. Defines the app's navigation structure and screen hierarchy.

### app/screens
Contains the main screen components. Each screen represents a full-page view in the application.

### app/services
Contains service integrations, API clients, and other external service interfaces.

#### app/services/websocket
Contains WebSocket implementation files:
- `WebSocketService.ts`: Core WebSocket functionality
- `types.ts`: TypeScript interfaces and types
- `useWebSocket.ts`: React hook for WebSocket usage
- `index.ts`: Barrel file for WebSocket exports

### app/config
Contains configuration files including WebSocket settings.

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

## WebSocket-Related Files

The WebSocket implementation is organized across several files:

1. **Service Implementation**
   - `app/services/websocket/WebSocketService.ts`
   - `app/services/websocket/types.ts`
   - `app/services/websocket/useWebSocket.ts`
   - `app/services/websocket/index.ts`

2. **Configuration**
   - `app/config/websocket.ts`

3. **Documentation**
   - `docs/websockets.md`

4. **Integration**
   - `app/screens/ChatScreen.tsx`

This structure follows the Ignite boilerplate conventions while incorporating custom additions for the Onyx project. The organization emphasizes modularity, reusability, and clear separation of concerns.