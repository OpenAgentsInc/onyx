# Project File Hierarchy

```
src/
├── app.tsx                     # Root app component with navigation container and font loading
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
│   └── Router.tsx              # Custom router using Zustand
├── onboarding/                 # Onboarding flow screens (using DOM components)
│   ├── Onboarding1.tsx         # First onboarding screen
│   ├── Onboarding{2-9}.tsx     # Second through ninth onboarding screen
│   └── Onboarding10.tsx        # Final onboarding screen
├── screens/                    # Main tab screens (using DOM components)
│   ├── AnalysisScreen.tsx      # Analysis tab with data visualization
│   ├── CommunityScreen.tsx     # Community tab with reports
│   ├── FeedbackScreen.tsx      # Feedback submission screen
│   └── MarketplaceScreen.tsx   # Marketplace tab with data requests
├── store/                      # Zustand stores
│   ├── useOnboardingStore.ts   # Onboarding state
│   └── useRouterStore.ts       # Navigation state
├── theme/
│   └── typography.ts           # Font configuration
└── utils/
    ├── isEmulator.ts           # Check if we're running in emulator
    └── useIsFocused.ts         # Hook to see if app is focused

Key Files:
- src/app.tsx: Main app component with navigation setup and font loading
- src/navigation/Router.tsx/RootNavigator.tsx: Main navigation logic and onboarding state management
- src/store/useOnboardingStore.ts: Persistent storage for onboarding state
- src/store/useRouterStore.ts: Navigation state management

## Onboarding Flow (DOM Components)
- Sequential screens introducing app features
- Uses Card component for consistent layout
- Prevents back navigation
- Updates persistent state on completion

## State Management
- useOnboardingStore: Zustand store with AsyncStorage persistence
  - Tracks onboarding completion state
  - Used by root navigator for routing decisions
- useRouterStore: Zustand store for navigation
  - Handles screen transitions
  - Manages navigation state

## Theme Configuration
- typography.ts: Font family definitions
- Used by root app for font loading

## Components
- Shared UI components used across screens
- Card: Main container component used in all screens
- Button: Common button component with themes
- Other components for specific UI needs
- Consistent styling and behavior
- Dark theme optimized

## DOM Component Usage
All screens now use DOM components with:
- 'use dom' directive
- div containers instead of View
- Card component for layout
- Inline styles with TypeScript types
- Consistent typography and spacing
- Responsive heights (100vh)
- Standardized font families
```
