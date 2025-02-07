import type { HvBehavior } from '@hyperview/core';
import { events } from '../../../services/events';

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
        // Emit event for token handling
        events.emit('auth:set-token', { token });
        console.log('[Auth] Token event emitted');

        // Get href for navigation after auth
        const href = element.getAttribute('href');
        if (href) {
          console.log('[Auth] Navigating to:', href);
          onUpdate(element, { href, action: 'replace' });
        }
      } catch (error) {
        console.error('[Auth] Error:', error);
      }
    }
  },
};