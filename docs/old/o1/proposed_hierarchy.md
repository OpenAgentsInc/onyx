```
onyx/                                 # Root of the Onyx application
├── .env                              # Environment variables for app configuration
├── android/                          # Android native project code
│   ├── app/                          # Android app-specific configuration and code
│   ├── build.gradle                  # Android build configuration
│   ├── gradle/                       # Gradle wrapper and config
│   ├── gradle.properties             # Gradle project properties
│   ├── gradlew                       # Gradle wrapper script (Unix)
│   ├── gradlew.bat                   # Gradle wrapper script (Windows)
│   ├── keystores/                    # Keystores for signing the Android app
│   └── settings.gradle               # Android project settings
├── ios/                              # iOS native project code
│   ├── Onyx/                         # iOS app project files
│   ├── Onyx-tvOS/                    # tvOS configuration
│   ├── Onyx-tvOSTests/               # tvOS tests
│   ├── Onyx.xcodeproj                # Xcode project configuration
│   └── OnyxTests/                    # iOS unit tests
├── ignite/                           # Ignite CLI templates and boilerplate files
│   └── templates/
│       ├── app-icon/                 # Template for app icons
│       ├── component/                # Template for generating new components
│       ├── model/                    # Template for generating new MST models
│       ├── navigator/                # Template for navigators
│       └── screen/                   # Template for new screens
├── assets/                           # Static assets
│   ├── icons/                        # PNG icons for UI elements
│   │   ├── back.png                  # Back navigation icon
│   │   ├── bell.png                  # Notification bell icon
│   │   ├── check.png                 # Checkmark icon
│   │   └── ...                       # Other icons
│   └── images/                       # Image assets (png/jpg/gif)
│       ├── logo.png                  # Onyx logo image
│       └── ...                       # Other images
├── docs/                             # Project documentation
│   ├── hierarchy.md                  # Project structure documentation
│   ├── websockets.md                 # WebSocket implementation details
│   ├── mcp/                          # Model Context Protocol docs
│   │   ├── README.md                 # MCP overview
│   │   ├── architecture.md           # MCP architecture details
│   │   ├── implementation-plan.md    # MCP implementation roadmap
│   │   ├── implementation-log.md     # Log of MCP integration steps
│   │   ├── onyx_strategy.md          # Onyx strategy for MCP integration
│   │   ├── roots.md                  # MCP roots concept documentation
│   │   ├── sampling.md               # Sampling feature documentation
│   │   ├── spec_summary.md           # Summary of MCP spec
│   │   └── typescript-sdk.md         # Instructions for MCP TypeScript SDK usage
│   └── DVM_integration.md            # Guide for integrating NIP-90 Data Vending Machines
├── test/                             # Test configs and mocks
│   ├── __snapshots__/                # Jest snapshot tests
│   ├── mockFile.ts                   # Mock file for testing
│   └── setup.ts                      # Test setup configuration
├── index.js                          # React Native app entry point
├── package.json                      # NPM package configuration
└── app/                              # Main application code
    ├── app.tsx                       # Main App component (entry to RN app)
    ├── components/                   # Reusable UI components
    │   ├── AutoImage.tsx             # Auto-sizing image component
    │   ├── Button.tsx                # Customizable button component
    │   ├── Card.tsx                  # UI card layout component
    │   ├── EmptyState.tsx            # Display for empty data states
    │   ├── Header.tsx                # Header bar component
    │   ├── Icon.tsx                  # Icon wrapper component
    │   ├── ListItem.tsx              # List item component for lists
    │   ├── ListView.tsx              # Scrollable list view component
    │   ├── NexusOverlay.tsx          # Legacy WebSocket status overlay (example)
    │   ├── NIP90Overlay.tsx          # Overlay showing DVM (NIP-90) job status
    │   ├── Screen.tsx                # Screen container with preset styles
    │   ├── Text.tsx                  # Text component with styling presets
    │   ├── TextField.tsx             # Text input field component
    │   ├── Toggle/                   # Toggleable UI elements
    │   │   ├── Checkbox.tsx          # Checkbox component
    │   │   ├── Radio.tsx             # Radio button component
    │   │   └── Toggle.tsx            # Generic toggle component
    │   ├── VectorIcon.tsx            # Vector icon component using icon fonts
    │   └── index.ts                  # Components barrel file
    ├── config/                       # App configuration files
    │   ├── env.ts                    # Environment variable loader
    │   └── websocket.ts              # WebSocket config for servers and endpoints
    ├── devtools/                     # Developer tools and debugging utilities
    ├── i18n/                         # Internationalization config and translations
    ├── models/                       # MobX State Tree models for state management
    │   ├── RootStore.ts              # Root MST store combining all models
    │   ├── RecordingStore.ts         # Store for audio recording state
    │   ├── ChatStore.ts              # Store for chat messages and state
    │   ├── DVMJobsStore.ts           # Store for managing DVM job requests and statuses
    │   └── MCPResourcesStore.ts      # Store for caching MCP resources in MST
    ├── navigators/                   # Navigation configuration (React Navigation)
    │   ├── AppNavigator.tsx          # Main stack navigator for the app
    │   ├── DemoNavigator.tsx         # Demo screens navigator
    │   └── MainNavigator.tsx         # Tab or drawer navigator for main sections
    ├── screens/                      # Screen components for each view
    │   ├── ChatScreen.tsx            # Chat UI with voice input and AI responses
    │   ├── CommunityScreen.tsx       # Community features screen
    │   ├── ErrorScreen/              # Screens for error handling
    │   │   └── ErrorBoundary.tsx     # Boundary component catching render errors
    │   ├── HomeScreen.tsx            # Home landing screen
    │   ├── LoginScreen.tsx           # Login/authentication screen
    │   ├── OnyxScreen.tsx            # Main Onyx AI agent interface (3D orb, voice input)
    │   ├── ProfileScreen.tsx         # User profile screen
    │   ├── UpdaterScreen.tsx         # App update/install flow screen
    │   ├── WalletScreen.tsx          # Bitcoin/Lightning wallet management screen
    │   ├── WelcomeScreen.tsx         # Onboarding/welcome flow screen
    │   └── index.ts                  # Screens barrel file
    ├── services/                     # External services (API, MCP, Nostr, DVM)
    │   ├── api/                      # REST API services for data fetch/update
    │   ├── mcp/                      # MCP service integrations
    │   │   ├── client/               # MCP client core
    │   │   │   ├── OnyxMCPClient.ts  # MCP client to communicate with MCP servers
    │   │   │   ├── types.ts          # Type definitions for MCP requests/responses
    │   │   │   └── errors.ts         # Custom error classes for MCP operations
    │   │   ├── transport/            # Transport layer for MCP (WebSocket)
    │   │   │   ├── WebSocketTransport.ts # WebSocket-based transport for MCP JSON-RPC
    │   │   │   ├── ConnectionManager.ts  # Manages reconnections and state for MCP transport
    │   │   │   └── types.ts          # Transport-specific type definitions
    │   │   ├── cache/                # Caching layer for MCP resources
    │   │   │   ├── ResourceCache.ts  # Caches MCP resource results locally
    │   │   │   └── types.ts          # Types for caching logic
    │   │   ├── storage/              # Persistent storage for MCP data
    │   │   │   ├── AsyncStorage.ts   # AsyncStorage integration for MCP caching
    │   │   │   └── types.ts          # Types for storage interfaces
    │   │   ├── sync/                 # Background sync for MCP
    │   │   │   ├── BackgroundSync.ts # Periodically sync MCP resources & tools
    │   │   │   ├── types.ts          # Sync-specific types
    │   │   │   └── index.ts          # Sync barrel file
    │   │   ├── offline/              # Offline support for MCP
    │   │   │   ├── OfflineManager.ts # Manage MCP requests offline-first
    │   │   │   ├── types.ts          # Offline support types
    │   │   │   └── index.ts          # Offline barrel file
    │   │   ├── network/              # Network optimization for MCP
    │   │   │   ├── NetworkOptimizer.ts # Adjust MCP request patterns based on network conditions
    │   │   │   ├── types.ts          # Network optimization types
    │   │   │   └── index.ts          # Network barrel file
    │   │   ├── hooks/                # React hooks for MCP usage
    │   │   │   ├── useMCPClient.ts   # Hook providing connected MCP client instance
    │   │   │   └── useMCPResource.ts # Hook to fetch & cache MCP resources in components
    │   │   └── index.ts              # MCP barrel file exporting all MCP-related services
    │   ├── websocket/                # WebSocket services for Nostr or custom backends
    │   │   ├── WebSocketService.ts   # Generic WebSocket abstraction with reconnect logic
    │   │   ├── types.ts              # Type definitions for WebSocket messages & states
    │   │   ├── useWebSocket.ts       # React hook to integrate WebSocket state into UI
    │   │   └── index.ts              # Barrel file for WebSocket services
    │   ├── dvm/                      # Data Vending Machine (NIP-90) integration
    │   │   ├── DVMClient.ts          # Client to submit job requests (kind:5000-5999) and await results (6000-6999)
    │   │   ├── DVMJobManager.ts      # Logic for creating, tracking, and fulfilling DVM jobs
    │   │   ├── PaymentHandler.ts     # Handles Lightning payments for DVM job results
    │   │   ├── EncryptionManager.ts  # Handles NIP-04 encryption for secure event payloads
    │   │   ├── DiscoveryService.ts   # Uses NIP-89 to discover recommended DVM service providers
    │   │   └── types.ts              # DVM-specific types (JobRequest, JobResult, Feedback events)
    │   ├── nostr/                    # Nostr-related integrations
    │   │   ├── NostrClient.ts        # Connects to relays and subscribes to Nostr events
    │   │   ├── NostrEventParser.ts   # Parses and validates Nostr events
    │   │   └── types.ts              # Types for Nostr keys, events, filters
    │   └── index.ts                  # Services barrel file
    ├── theme/                        # Styling and theming (colors, typography, spacing)
    │   ├── color.ts                  # App color palette
    │   ├── spacing.ts                # App spacing scales
    │   ├── typography.ts             # Font and text styling
    │   └── index.ts                  # Theme barrel file
    ├── types/                        # Global TypeScript type definitions
    │   └── websocket.ts              # WebSocket type definitions shared across app
    └── utils/                        # Utility functions and helpers
        ├── dateHelpers.ts            # Helpers for date formatting & parsing
        ├── formatting.ts             # General formatting utilities
        ├── networkHelpers.ts         # Utilities for detecting network type & conditions
        └── index.ts                  # Utils barrel file
```
