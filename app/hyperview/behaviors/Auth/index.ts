import type { HvBehavior } from '@hyperview/core';
import { events } from '../../../services/events';
import Config from '../../../config';

export const AuthBehavior: HvBehavior = {
  action: 'auth',
  callback: async (behaviorElement, onUpdate, getRoot) => {
    // Early return if no element
    if (!behaviorElement) {
      console.error('[Auth] Error: behaviorElement is missing');
      return;
    }

    console.log('[Auth] Behavior triggered');
    
    // Keep reference to element
    const element = behaviorElement;
    const action = element.getAttribute('auth-action');
    const token = element.getAttribute('token');
    const href = element.getAttribute('href');
    const showDuringLoad = element.getAttribute('show-during-load');
    const hideDuringLoad = element.getAttribute('hide-during-load');
    
    console.log('[Auth] Action:', action);
    console.log('[Auth] Token:', token);
    console.log('[Auth] Href:', href);

    // Get root for loading/error elements
    const root = getRoot();
    const showElement = showDuringLoad ? root.getElementById(showDuringLoad) : null;
    const hideElement = hideDuringLoad ? root.getElementById(hideDuringLoad) : null;
    const errorElement = root.getElementById('error-message');

    const showLoading = () => {
      if (showElement) onUpdate(showElement, { display: 'flex' });
      if (hideElement) onUpdate(hideElement, { display: 'none' });
      if (errorElement) onUpdate(errorElement, { display: 'none' });
    };

    const hideLoading = () => {
      if (showElement) onUpdate(showElement, { display: 'none' });
      if (hideElement) onUpdate(hideElement, { display: 'flex' });
    };

    const showError = () => {
      if (errorElement) {
        onUpdate(errorElement, { display: 'flex' });
        setTimeout(() => {
          onUpdate(errorElement, { display: 'none' });
        }, 3000);
      }
    };

    if (action === 'set-token' && token && !token.includes('$params')) {
      try {
        // Emit event for token handling
        events.emit('auth:set-token', { token });
        console.log('[Auth] Token event emitted');

        // Navigate after auth if href provided
        if (href) {
          console.log('[Auth] Navigating to:', href);
          onUpdate(element, { href, action: 'replace' });
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
        
        const response = await fetch(logoutUrl, {
          credentials: 'include',
          headers: {
            Accept: 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Logout failed: ${response.status}`);
        }
        console.log('[Auth] Server logout completed');

        // Emit logout event
        events.emit('auth:logout');
        console.log('[Auth] Logout event emitted');

        // Wait for logout to complete
        await new Promise(resolve => setTimeout(resolve, 100));

        // Navigate after logout if href provided
        if (href) {
          console.log('[Auth] Navigating to:', href);
          onUpdate(element, { 
            href: '/templates/pages/auth/login.xml', 
            action: 'replace',
            reload: true 
          });
        }
      } catch (error) {
        console.error('[Auth] Error during logout:', error);
        hideLoading();
        showError();
      }
    }
  },
};