# Project File Hierarchy

```
src/
├── app/
│   ├── _layout.tsx               # Root layout with navigation logic and font loading
│   ├── (tabs)/                   # Tab navigation group
│   │   ├── _layout.tsx          # Tab navigation configuration
│   │   ├── index.tsx            # Tab index (redirects to marketplace)
│   │   ├── marketplace.tsx      # Marketplace tab screen
│   │   ├── analysis.tsx         # Analysis tab screen
│   │   ├── community.tsx        # Community tab screen
│   │   └── feedback.tsx         # Feedback tab screen
│   ├── onboarding/              # Onboarding flow group
│   │   ├── _layout.tsx          # Onboarding navigation configuration
│   │   ├── index.tsx            # Onboarding index (redirects to first screen)
│   │   ├── Onboarding1.tsx      # First onboarding screen
│   │   ├── Onboarding2.tsx      # Second onboarding screen
│   │   └── Onboarding3.tsx      # Third onboarding screen
│   └── old/                     # Legacy files
├── store/
│   └── useOnboardingStore.ts    # Zustand store for onboarding state
└── theme/
    └── typography.ts            # Font configuration

Key Files:
- src/app/_layout.tsx: Main navigation logic, font loading, and onboarding state management
- src/app/(tabs)/_layout.tsx: Tab bar configuration and tab screen definitions
- src/app/onboarding/_layout.tsx: Onboarding flow navigation configuration
- src/store/useOnboardingStore.ts: Persistent storage for onboarding state

Navigation Flow:
1. Root layout (_layout.tsx) checks onboarding state
2. If not onboarded:
   - Redirects to /onboarding
   - Index redirects to Onboarding1
   - User progresses through Onboarding1-3
3. If onboarded:
   - Redirects to /(tabs)
   - Index redirects to marketplace tab

File Details:

## Root Layout (_layout.tsx)
- Handles font loading
- Manages navigation based on onboarding state
- Uses Slot for rendering child routes
- Provides ThemeProvider context

## Tab Navigation ((tabs)/_layout.tsx)
- Configures bottom tab bar
- Defines tab screens and icons
- Handles tab-specific navigation
- Marketplace is the default tab

## Onboarding Flow (onboarding/*)
- _layout.tsx: Stack navigator for onboarding screens
- index.tsx: Redirects to first onboarding screen
- Onboarding1-3.tsx: Sequential onboarding screens
- Uses static Link navigation between screens

## State Management
- useOnboardingStore.ts: Zustand store with persistence
- Tracks onboarding completion state
- Used by root layout for navigation decisions

## Theme Configuration
- typography.ts: Font family definitions
- Used by root layout for font loading
```