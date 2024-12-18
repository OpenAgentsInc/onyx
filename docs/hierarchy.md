# Project File Hierarchy

```
src/
├── app.tsx                    # Root app component with navigation container and font loading
├── navigation/               # Navigation configuration
│   ├── RootNavigator.tsx    # Root navigation logic and onboarding state management
│   ├── TabNavigator.tsx     # Tab bar configuration with icons
│   └── OnboardingNavigator.tsx # Onboarding flow navigation
├── screens/                 # Main tab screens (using DOM components)
│   ├── MarketplaceScreen.tsx # Marketplace tab with data requests
│   ├── AnalysisScreen.tsx   # Analysis tab with data visualization
│   ├── CommunityScreen.tsx  # Community tab with reports
│   └── FeedbackScreen.tsx   # Feedback submission screen
├── onboarding/             # Onboarding flow screens (using DOM components)
│   ├── Onboarding1.tsx     # First onboarding screen
│   ├── Onboarding2.tsx     # Second onboarding screen
│   └── Onboarding3.tsx     # Third onboarding screen
├── store/
│   ├── useOnboardingStore.ts # Zustand store for onboarding state
│   └── useRouterStore.ts    # Zustand store for navigation state
├── components/             # Shared UI components
│   ├── Badge.tsx          # Badge component for status indicators
│   ├── Button.tsx         # Common button component
│   ├── Card.tsx          # Card container component
│   ├── Checkbox.tsx      # Checkbox input component
│   ├── DataTable.tsx     # Table component for data display
│   ├── RadioButtonGroup.tsx # Radio button group component
│   └── TextArea.tsx      # Text input component
└── theme/
    └── typography.ts      # Font configuration

Key Files:
- src/app.tsx: Main app component with navigation setup and font loading
- src/navigation/RootNavigator.tsx: Main navigation logic and onboarding state management
- src/navigation/TabNavigator.tsx: Tab bar configuration with screens and icons
- src/store/useOnboardingStore.ts: Persistent storage for onboarding state
- src/store/useRouterStore.ts: Navigation state management

Navigation Flow:
1. Root navigator checks onboarding state
2. If not onboarded:
   - Shows OnboardingNavigator
   - User progresses through Onboarding1-3
   - After completion, state is updated
3. If onboarded:
   - Shows TabNavigator
   - Default tab is Marketplace

File Details:

## Root App (app.tsx)
- Handles font loading
- Provides NavigationContainer
- Manages splash screen
- Provides ThemeProvider context

## Navigation
- RootNavigator: Manages onboarding state and main navigation flow
- TabNavigator: Configures bottom tab bar with icons
- OnboardingNavigator: Manages onboarding screen flow

## Screens (DOM Components)
- MarketplaceScreen: Data request marketplace with active requests
  - Uses Card component for layout
  - Consistent styling with other screens
- AnalysisScreen: Data analysis tools and visualization
  - Uses Card component for layout
  - Data visualization dashboard
- CommunityScreen: Community reports and verification
  - Uses Card component for layout
  - Community hub interface
- FeedbackScreen: User feedback submission
  - Uses Card component for layout
  - Feedback form interface

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