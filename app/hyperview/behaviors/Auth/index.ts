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

    // Create update functions that use the captured element reference
    const updateElement = (el: Element | null, updates: any) => {
      if (el) {
        try {
          onUpdate(el, updates);
        } catch (error) {
          console.error('[Auth] Error updating element:', error);
        }
      }
    };

    const showLoading = () => {
      updateElement(showElement, { display: 'flex' });
      updateElement(hideElement, { display: 'none' });
      updateElement(errorElement, { display: 'none' });
    };

    const hideLoading = () => {
      updateElement(showElement, { display: 'none' });
      updateElement(hideElement, { display: 'flex' });
    };

    const showError = () => {
      if (errorElement) {
        updateElement(errorElement, { display: 'flex' });
        setTimeout(() => {
          updateElement(errorElement, { display: 'none' });
        }, 3000);
      }
    };

    const navigate = (el: Element, navHref: string) => {
      try {
        console.log('[Auth] Navigating to:', navHref);
        onUpdate(el, { 
          href: navHref, 
          action: 'replace',
          reload: true 
        });
      } catch (error) {
        console.error('[Auth] Navigation error:', error);
      }
    };

    if (action === 'set-token' && token && !token.includes('$params')) {
      try {
        // Emit event for token handling
        events.emit('auth:set-token', { token });
        console.log('[Auth] Token event emitted');

        // Navigate after auth if href provided
        if (href) {
          navigate(element, href);
        }
      } catch (error) {
        console.error('[Auth] Error:', error);
        showError();
      }
    } else if (action === 'logout') {
      try {
        showLoading();

        // First emit logout event to clear local state
        events.emit('auth:logout');
        console.log('[Auth] Logout event emitted');

        // Wait for local state to clear
        await new Promise(resolve => setTimeout(resolve, 100));

        // Then call server logout endpoint
        const logoutUrl = `${Config.API_URL}/auth/logout?platform=mobile`;
        console.log('[Auth] Calling logout URL:', logoutUrl);
        
        const response = await fetch(logoutUrl, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });

        if (!response.ok) {
          throw new Error(`Logout failed: ${response.status}`);
        }
        console.log('[Auth] Server logout completed');

        // Wait for server logout to complete
        await new Promise(resolve => setTimeout(resolve, 100));

        // Navigate after logout if href provided
        if (href) {
          navigate(element, href);
        }
      } catch (error) {
        console.error('[Auth] Error during logout:', error);
        hideLoading();
        showError();
      }
    }
  },
};