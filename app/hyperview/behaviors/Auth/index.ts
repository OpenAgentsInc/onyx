import type { HvBehavior } from '@hyperview/core';
import { events } from '../../../services/events';
import Config from '../../../config';

export const AuthBehavior: HvBehavior = {
  action: 'auth',
  callback: async (behaviorElement, onUpdate) => {
    if (!behaviorElement) {
      console.error('[Auth] Error: behaviorElement is missing');
      return;
    }

    console.log('[Auth] Behavior triggered');
    
    const action = behaviorElement.getAttribute('auth-action');
    const token = behaviorElement.getAttribute('token');
    const href = behaviorElement.getAttribute('href');
    const showDuringLoad = behaviorElement.getAttribute('show-during-load');
    const hideDuringLoad = behaviorElement.getAttribute('hide-during-load');
    
    console.log('[Auth] Action:', action);
    console.log('[Auth] Token:', token);
    console.log('[Auth] Href:', href);

    // Show/hide loading states
    const showElement = showDuringLoad ? document.getElementById(showDuringLoad) : null;
    const hideElement = hideDuringLoad ? document.getElementById(hideDuringLoad) : null;

    const showLoading = () => {
      if (showElement) showElement.style.display = 'flex';
      if (hideElement) hideElement.style.display = 'none';
    };

    const hideLoading = () => {
      if (showElement) showElement.style.display = 'none';
      if (hideElement) hideElement.style.display = 'flex';
    };

    if (action === 'set-token' && token && !token.includes('$params')) {
      try {
        // Emit event for token handling
        events.emit('auth:set-token', { token });
        console.log('[Auth] Token event emitted');

        // Navigate after auth if href provided
        if (href) {
          console.log('[Auth] Navigating to:', href);
          onUpdate(behaviorElement, { href, action: 'replace' });
        }
      } catch (error) {
        console.error('[Auth] Error:', error);
      }
    } else if (action === 'logout') {
      try {
        showLoading();

        // First call server logout endpoint
        const logoutUrl = `${Config.API_URL}/auth/logout?platform=mobile`;
        console.log('[Auth] Calling logout URL:', logoutUrl);
        
        const response = await fetch(logoutUrl);
        if (!response.ok) {
          throw new Error(`Logout failed: ${response.status}`);
        }
        console.log('[Auth] Server logout completed');

        // Emit logout event
        events.emit('auth:logout');
        console.log('[Auth] Logout event emitted');

        // Wait for logout to complete
        await new Promise(resolve => setTimeout(resolve, 500));

        // Navigate after logout if href provided
        if (href) {
          console.log('[Auth] Navigating to:', href);
          onUpdate(behaviorElement, { 
            href: '/templates/pages/auth/login.xml', 
            action: 'replace',
            reload: true 
          });
        }
      } catch (error) {
        console.error('[Auth] Error during logout:', error);
        hideLoading();

        // Show error message
        const errorElement = document.getElementById('error-message');
        if (errorElement) {
          errorElement.style.display = 'flex';
          setTimeout(() => {
            errorElement.style.display = 'none';
          }, 3000);
        }
      }
    }
  },
};