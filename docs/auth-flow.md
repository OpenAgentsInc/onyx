# Authentication Flow Analysis

## App Initialization Flow

1. App Start ([app/app.tsx](../app/app.tsx))
   ```
   [App] Starting...
   [App] Loaded: false
   [App] Rehydrated: false
   [App] Showing loading screen...
   ```

2. Notifications Setup (Non-critical)
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
   [Auth] Checking auth state, token: github_14167547
   [Auth] Restored auth state: {"isAuthenticated": true}
   [Auth] Providing auth context: {"isAuthenticated": true}
   ```

5. API Configuration ([app/config/index.ts](../app/config/index.ts))
   ```
   [App] API URL: http://localhost:8000
   [App] Initial auth state: {"isAuthenticated": true}
   ```

6. Initial Navigation Setup
   ```
   [App] Setting entrypoint: http://localhost:8000/hyperview/main
   [App] Setting up auth event handlers
   [App] Setting up deep link handlers
   ```

7. State Rehydration
   ```
   [App] Starting...
   [App] Loaded: true
   [App] Rehydrated: true
   ```

## Current Login Flow (Working)

1. App starts with `isAuthenticated: false`
2. Shows login screen
3. User clicks "Continue with GitHub"
4. GitHub OAuth flow completes
5. Server creates session
6. Client stores token
7. AuthContext updates `isAuthenticated: true`
8. Navigates to main screen

## Current Logout Flow (Broken)

1. User clicks "Sign Out" button
2. Fetch behavior triggers to `/auth/logout?platform=mobile`
3. On response, triggers auth behavior with `auth-action="logout"`
4. Auth behavior attempts to:
   - Call `/auth/logout?platform=mobile` again (duplicate call)
   - Emit logout event
   - Navigate to login page
5. **Issues**:
   - Double logout call
   - Network request failing
   - Navigation error: "Custom behavior requires a behaviorElement"

## Authentication Components

1. Auth Context ([app/contexts/AuthContext.tsx](../app/contexts/AuthContext.tsx))
   - Manages auth state
   - Handles token storage
   - Provides auth methods

2. Auth Behavior ([app/hyperview/behaviors/Auth/index.ts](../app/hyperview/behaviors/Auth/index.ts))
   - Handles auth-related actions
   - Manages navigation after auth events
   - **Issue**: Not properly handling navigation after logout

3. Server Routes ([src/server/config.rs](../src/server/config.rs))
   ```rust
   .route("/auth/login", post(server::handlers::handle_login))
   .route("/auth/logout", get(server::handlers::auth::clear_session_and_redirect))
   .route("/auth/github/login", get(server::handlers::auth::handle_github_login))
   .route("/auth/github/callback", get(server::handlers::auth::handle_github_callback))
   ```

## Current Issues

1. **Double Logout Call**
   - Main screen template uses fetch + auth behavior pattern
   - Results in two calls to logout endpoint
   - First call fails, second call never completes

2. **Navigation Error**
   - After logout, getting "Custom behavior requires a behaviorElement"
   - Likely due to trying to navigate after element is removed from DOM

3. **Loading State Issues**
   - Loading state shows briefly but doesn't properly hide
   - No error state shown when logout fails

4. **Network Request Failure**
   - Logout request failing with "Network request failed"
   - Server logs show request received but client can't complete

## Required Fixes

1. **Simplify Logout Flow**
   - Remove fetch + auth behavior pattern
   - Use single auth behavior for logout
   - Handle server call and navigation in one step

2. **Fix Navigation**
   - Keep behavior element in DOM until navigation completes
   - Use proper navigation action (replace vs push)
   - Handle navigation errors gracefully

3. **Improve Error Handling**
   - Show error state when logout fails
   - Provide retry mechanism
   - Log detailed error information

4. **Fix Network Issues**
   - Investigate why fetch request is failing
   - Ensure proper CORS headers
   - Add request/response logging

## Ideal Logout Flow (Should Be)

1. User clicks "Sign Out"
2. Show loading state
3. Single auth behavior:
   - Calls server logout endpoint
   - Waits for response
   - Clears local storage
   - Navigates to login page
4. Handle errors gracefully
5. Show appropriate loading/error states

## Server-Side Flow

1. Receive logout request
2. Clear session cookie
3. Send response with:
   - Success status
   - Clear cookie header
   - Proper CORS headers
4. Log success/failure