# Authentication Flow Analysis

## Current State (As of 2025-02-08)

### Working Components

1. **Server-Side**
   - Endpoint `/auth/logout` works
   - Session clearing works
   - Mobile redirect works
   - CORS configuration added

2. **Client-Side**
   - Auth context works
   - Token storage works
   - Event system works
   - Deep link handling works

### Broken Components

1. **Network Layer**
   - Mobile app can't reach localhost
   - Network requests failing
   - CORS still having issues

2. **UI Layer**
   - Behavior element persistence issues
   - Loading states not reliable
   - Error states not showing properly

3. **Navigation**
   - Timing issues during logout
   - State cleanup race conditions
   - Deep link handling incomplete

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
// Configure CORS with specific origins
let cors = CorsLayer::new()
    .allow_origin([
        "http://localhost:3000".parse::<HeaderValue>().unwrap(),
        "http://localhost:8000".parse::<HeaderValue>().unwrap(),
        "https://openagents.com".parse::<HeaderValue>().unwrap(),
        "onyx://localhost".parse::<HeaderValue>().unwrap(),
    ])
    .allow_methods([
        Method::GET,
        Method::POST,
        Method::OPTIONS,
    ])
    .allow_headers([
        HeaderName::from_static("content-type"),
        HeaderName::from_static("authorization"),
        HeaderName::from_static("accept"),
    ])
    .allow_credentials(true);
```

## Current Issues

1. **Development Environment**
   - Mobile app can't reach localhost
   - CORS configuration not working
   - Network requests failing

2. **Behavior Element Issues**
   - Element lost during async operations
   - Multiple element warnings
   - State management problems

3. **Navigation Problems**
   - Timing issues during logout
   - State cleanup race conditions
   - Deep link handling incomplete

## Required Changes

1. **Environment Setup**
```bash
# Use proper development URLs
API_URL=http://YOUR_MACHINE_IP:8000
MOBILE_REDIRECT=onyx://auth/callback
```

2. **Auth Flow Changes**
```typescript
// Simplified logout flow
if (action === 'logout') {
  // 1. Clear local state first
  await clearLocalState();
  
  // 2. Show loading state
  showLoading();
  
  try {
    // 3. Call server
    await logout();
    
    // 4. Navigate
    navigate('/auth/login');
  } catch (error) {
    // 5. Error handling
    showError();
    restoreState();
  }
}
```

3. **Error Handling**
```typescript
// Proper error recovery
const handleError = async (error: Error) => {
  // 1. Log error
  console.error('[Auth] Error:', error);
  
  // 2. Show user feedback
  showError(error.message);
  
  // 3. Restore state if needed
  await restoreState();
  
  // 4. Reset UI
  hideLoading();
};
```

## Next Steps

1. **Fix Development Environment**
   - Use proper mobile development URLs
   - Configure CORS correctly
   - Handle localhost -> device IP mapping

2. **Improve Auth Flow**
   - Simplify logout flow
   - Remove unnecessary async operations
   - Handle state cleanup properly

3. **Add Error Handling**
   - Add proper error recovery
   - Add state rollback
   - Add user feedback

4. **Add Tests**
   - Test with proper development URLs
   - Test with actual device IP
   - Test error scenarios

## Testing Plan

1. **Development Setup**
   - Configure proper development URLs
   - Test CORS configuration
   - Test network connectivity

2. **Auth Flow**
   - Test logout flow
   - Test state cleanup
   - Test navigation

3. **Error Handling**
   - Test network errors
   - Test state recovery
   - Test user feedback



Here's the complete list of relevant files for the logout functionality:

OpenAgentsInc/onyx (Branch: feature/logout):
```
app/
├── app.tsx                           # Main app component
├── contexts/
│   └── AuthContext.tsx              # Auth state management
├── hyperview/
│   └── behaviors/
│       ├── Auth/
│       │   └── index.ts             # Auth behavior implementation
│       └── index.ts                 # Behavior registration
├── services/
│   └── events.ts                    # Event system
└── config/
    └── index.ts                     # App configuration
```

OpenAgentsInc/openagents (Branch: logout):
```
src/
├── server/
│   ├── config.rs                    # Server configuration and CORS
│   └── handlers/
│       └── auth/
│           ├── mod.rs               # Auth handler exports
│           ├── session.rs           # Session management
│           └── github.rs            # GitHub auth handlers
templates/
├── pages/
│   ├── main.xml                     # Main app template
│   └── auth/
│       ├── login.xml                # Login screen template
│       ├── callback.xml             # Auth callback template
│       ├── error.xml                # Error screen template
│       └── loading.xml              # Loading screen template
```

Key files that need changes:
1. `app/hyperview/behaviors/Auth/index.ts` - Fix behavior element persistence
2. `src/server/config.rs` - Fix CORS configuration
3. `templates/pages/main.xml` - Update logout button behavior
4. `templates/pages/auth/login.xml` - Update login screen
5. `app/contexts/AuthContext.tsx` - Improve state management
6. `src/server/handlers/auth/session.rs` - Update session handling

These files form the core of the auth system and need to be modified to fix the logout functionality. Let me know if you need details about any specific file or its current implementation.
