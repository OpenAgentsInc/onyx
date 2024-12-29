## App initialization flow

- pacakage.json defines entry: `"main": "app/app.tsx",`
- app/app.tsx
  - Imports polyfills
  - Sets up EAS auto updates
  - Sets up navigation
  - Rehydrates store, then hides splash screen
  - Includes providers for safearea, error boundary, keyboard
  - Wraps AppNavigator
