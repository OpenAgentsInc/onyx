# Authentication Flow Analysis

## Current State (As of 2025-02-08)

### Working Components

1. **Login Flow**
   - App starts with correct auth state
   - GitHub OAuth works
   - Token storage works
   - Navigation after login works

2. **Server-Side Logout**
   - Endpoint `/auth/logout` works
   - Session clearing works
   - Mobile redirect works

### Broken Components

1. **Client-Side Logout**
   - Network request fails
   - Behavior element errors
   - State management issues
   - Navigation timing issues

## Implementation Details

### Auth Context ([app/contexts/AuthContext.tsx](../app/contexts/AuthContext.tsx))
```typescript
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<GitHubUser | null>(null);

  // Check auth state on start
  useEffect(() => {
    checkAuthState();
  }, []);

  // Auth state management
  async function checkAuthState() {
    const token = await SecureStore.getItemAsync('session_token');
    setIsAuthenticated(!!token);
  }
}
```

### Auth Behavior ([app/hyperview/behaviors/Auth/index.ts](../app/hyperview/behaviors/Auth/index.ts))
```typescript
export const AuthBehavior: HvBehavior = {
  action: 'auth',
  callback: async (behaviorElement, onUpdate, getRoot) => {
    // Current implementation has issues with element persistence
    if (action === 'logout') {
      try {
        const logoutUrl = `${Config.API_URL}/auth/logout?platform=mobile`;
        const response = await fetch(logoutUrl);
        events.emit('auth:logout');
        onUpdate(behaviorElement, { 
          href: '/templates/pages/auth/login.xml', 
          action: 'replace',
          reload: true 
        });
      } catch (error) {
        // Error handling needs improvement
      }
    }
  }
};
```

### Server Routes ([src/server/config.rs](../src/server/config.rs))
```rust
.route("/auth/logout", get(server::handlers::auth::clear_session_and_redirect))
.route("/auth/github/login", get(server::handlers::auth::handle_github_login))
.route("/auth/github/callback", get(server::handlers::auth::handle_github_callback))
```

## Current Issues

1. **Behavior Element Errors**
   - Error: `Custom behavior requires a behaviorElement []`
   - Occurs during async operations
   - Element reference lost

2. **Network Request Failures**
   - Error: `[TypeError: Network request failed]`
   - Server receives request
   - Client fails to handle response

3. **State Management**
   - Loading states not properly handled
   - Error states not showing
   - Navigation timing issues

## Required Changes

1. **Auth Behavior Updates**
```typescript
export const AuthBehavior: HvBehavior = {
  action: 'auth',
  callback: async (behaviorElement, onUpdate, getRoot) => {
    // Keep reference
    const element = behaviorElement;
    
    // Proper request handling
    try {
      const response = await fetch(logoutUrl, {
        credentials: 'include',
        headers: {
          Accept: 'application/json'
        }
      });
      
      // Handle response
      if (response.ok) {
        events.emit('auth:logout');
        onUpdate(element, {
          href: '/templates/pages/auth/login.xml',
          action: 'replace',
          reload: true
        });
      }
    } catch (error) {
      // Show error state
      const root = getRoot();
      const errorElement = root.getElementById('error-message');
      if (errorElement) {
        onUpdate(errorElement, { display: 'flex' });
      }
    }
  }
};
```

2. **Server Response Headers**
```rust
Response::builder()
    .status(StatusCode::OK)
    .header("Access-Control-Allow-Origin", "*")
    .header("Access-Control-Allow-Credentials", "true")
    .body(...)
```

3. **Error Handling**
```typescript
const handleError = (error: Error) => {
  console.error('[Auth] Error:', error);
  const root = getRoot();
  
  // Hide loading
  const loadingElement = root.getElementById('loading-text');
  if (loadingElement) {
    onUpdate(loadingElement, { display: 'none' });
  }
  
  // Show error
  const errorElement = root.getElementById('error-message');
  if (errorElement) {
    onUpdate(errorElement, { display: 'flex' });
    setTimeout(() => {
      onUpdate(errorElement, { display: 'none' });
    }, 3000);
  }
};
```

## Next Steps

1. **Fix Element Persistence**
   - Keep element reference
   - Handle cleanup properly
   - Add error boundaries

2. **Fix Network Requests**
   - Add proper headers
   - Handle CORS correctly
   - Add request logging

3. **Improve State Management**
   - Add proper loading states
   - Add error recovery
   - Fix navigation timing

4. **Add Tests**
   - Test logout flow
   - Test error cases
   - Test state management