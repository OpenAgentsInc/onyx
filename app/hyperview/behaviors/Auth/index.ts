import type { HvBehavior } from '@hyperview/core';
import { useAuth } from '../../../contexts/AuthContext';

export const AuthBehavior: HvBehavior = {
  action: 'auth',
  callback: async (element, onUpdate, getRoot) => {
    console.log('[Auth] Behavior triggered');
    
    const action = element.getAttribute('auth-action');
    const token = element.getAttribute('token');
    
    console.log('[Auth] Action:', action);
    console.log('[Auth] Token:', token);

    if (action === 'set-token' && token) {
      try {
        const { handleAuthCallback } = useAuth();
        await handleAuthCallback(token);
        console.log('[Auth] Token set successfully');

        // Get href for navigation after auth
        const href = element.getAttribute('href');
        if (href) {
          console.log('[Auth] Navigating to:', href);
          onUpdate(element, { href, action: 'replace' });
        }
      } catch (error) {
        console.error('[Auth] Error setting token:', error);
      }
    }
  },
};