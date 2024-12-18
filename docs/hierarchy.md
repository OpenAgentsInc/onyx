# Project File Hierarchy

```
src/
├── app.tsx                    # Root app component with navigation container and font loading
├── navigation/               # Navigation configuration
│   ├── RootNavigator.tsx    # Root navigation logic and onboarding state management
│   ├── TabNavigator.tsx     # Tab bar configuration with icons
│   └── OnboardingNavigator.tsx # Onboarding flow navigation
├── screens/                 # Main tab screens
│   ├── MarketplaceScreen.tsx # Marketplace tab with data requests
│   ├── AnalysisScreen.tsx   # Analysis tab with data visualization
│   ├── CommunityScreen.tsx  # Community tab with reports
│   └── FeedbackScreen.tsx   # Feedback submission screen
├── onboarding/             # Onboarding flow screens
│   ├── Onboarding1.tsx     # First onboarding screen
│   ├── Onboarding2.tsx     # Second onboarding screen
│   └── Onboarding3.tsx     # Third onboarding screen
├── store/
│   └── useOnboardingStore.ts # Zustand store for onboarding state
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

## Screens
- MarketplaceScreen: Data request marketplace with active requests
- AnalysisScreen: Data analysis tools and visualization
- CommunityScreen: Community reports and verification
- FeedbackScreen: User feedback submission

## Onboarding Flow
- Sequential screens introducing app features
- Prevents back navigation
- Updates persistent state on completion

## State Management
- useOnboardingStore: Zustand store with AsyncStorage persistence
- Tracks onboarding completion state
- Used by root navigator for routing decisions

## Theme Configuration
- typography.ts: Font family definitions
- Used by root app for font loading

## Components
- Shared UI components used across screens
- Consistent styling and behavior
- Dark theme optimized
```