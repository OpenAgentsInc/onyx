# Authentication Flow Analysis

## App Initialization Flow

1. App Start ([app/app.tsx](../app/app.tsx))
   ```
   [App] Starting...
   [App] Loaded: false
   [App] Rehydrated: false
   [App] Showing loading screen...
   ```

2. Notifications Setup
   ```
   [App] Initializing notifications...
   Must use physical device for push notifications
   Error initializing notifications: [Error: Must use physical device for push notifications]
   ```

3. Second Start Phase
   ```
   [App] Starting...
   [App] Loaded: true
   [App] Rehydrated: false
   ```

4. Auth State Initialization ([app/contexts/AuthContext.tsx](../app/contexts/AuthContext.tsx))
   ```
   [Auth] Initializing auth state
   [Auth] Checking auth state, token: null
   [Auth] No valid token found
   [Auth] Providing auth context: {"isAuthenticated": false}
   ```

5. API Configuration ([app/config/index.ts](../app/config/index.ts))
   ```
   [App] API URL: http://localhost:8000
   [App] Initial auth state: {"isAuthenticated": false}
   ```

6. Initial Navigation Setup
   ```
   [App] Setting entrypoint: http://localhost:8000/templates/pages/auth/login.xml
   [App] Setting up auth event handlers
   [App] Setting up deep link handlers
   ```

7. State Rehydration
   ```
   [App] Starting...
   [App] Loaded: true
   [App] Rehydrated: true
   ```

## HXML Loading Flow

1. Initial Login Page Request
   ```
   Fetching: http://localhost:8000/templates/pages/auth/login.xml
   Init: {"headers": {"Accept": "application/xml, application/vnd.hyperview+xml"...}}
   ```

2. Login Page Response ([templates/pages/auth/login.xml](../templates/pages/auth/login.xml))
   - Contains:
     - GitHub login button
     - Loading state
     - Error message placeholder
     - **ISSUE: Contains auto-reload behavior that shouldn't be there:**
     ```xml
     <behavior
       trigger="load"
       action="reload"
       href="/hyperview/main"
     />
     ```

3. Auto-Navigation to Main (Due to reload behavior)
   ```
   Fetching: http://localhost:8000/hyperview/main
   ```

4. Main Page Response ([src/server/hyperview/handlers.rs](../src/server/hyperview/handlers.rs))
   - Contains:
     - Chat button
     - Logout button
     - Loading state

## Authentication Components

1. Auth Context ([app/contexts/AuthContext.tsx](../app/contexts/AuthContext.tsx))
   - Manages auth state
   - Handles token storage
   - Provides auth methods

2. Auth Behavior ([app/hyperview/behaviors/Auth/index.ts](../app/hyperview/behaviors/Auth/index.ts))
   - Handles auth-related actions
   - Manages navigation after auth events

3. Server Routes ([src/server/config.rs](../src/server/config.rs))
   ```rust
   .route("/auth/login", post(server::handlers::handle_login))
   .route("/auth/logout", get(server::handlers::auth::clear_session_and_redirect))
   .route("/auth/github/login", get(server::handlers::auth::handle_github_login))
   .route("/auth/github/callback", get(server::handlers::auth::handle_github_callback))
   ```

## Current Issues

1. **Auto-Navigation Bug**
   - The login page contains a `trigger="load"` behavior that automatically navigates to `/hyperview/main`
   - This bypasses authentication entirely
   - Location: [templates/pages/auth/login.xml](../templates/pages/auth/login.xml)

2. **Auth State Inconsistency**
   - App shows main screen even when `isAuthenticated: false`
   - No auth state check in main screen handler

3. **Missing Auth Guards**
   - Server doesn't verify authentication for protected routes
   - Client doesn't prevent navigation to protected routes

## Required Fixes

1. Remove auto-reload behavior from login.xml
2. Add auth checks to protected routes on server
3. Add auth state verification before showing main screen
4. Implement proper navigation guards in Hyperview handlers

## Normal Authentication Flow (Should Be)

1. App starts with `isAuthenticated: false`
2. Shows login screen
3. User clicks "Continue with GitHub"
4. GitHub OAuth flow completes
5. Server creates session
6. Client stores token
7. AuthContext updates `isAuthenticated: true`
8. Only then navigate to main screen

## Current Flow (Broken)

1. App starts with `isAuthenticated: false`
2. Shows login screen
3. Login screen immediately reloads to main screen due to `trigger="load"` behavior
4. Main screen shows without authentication
5. Protected routes accessible without auth