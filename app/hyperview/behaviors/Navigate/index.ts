import type { HvBehavior } from '@hyperview/core';
import Config from '@/config';

export const navigate: HvBehavior = {
  action: 'navigate',
  callback: async (element, context) => {
    console.log('[Navigate] Triggered');
    
    const href = element.getAttribute('href');
    console.log('[Navigate] href:', href);
    
    if (!href) {
      console.warn('[Navigate] No href attribute found');
      return;
    }

    const verb = element.getAttribute('verb') || 'GET';
    
    try {
      // Construct full URL
      const fullUrl = href.startsWith('http') ? href : `${Config.API_URL}${href}`;
      console.log('[Navigate] Navigating to:', fullUrl);
      
      // Use Hyperview's navigation system
      await context.navigation.navigate(fullUrl, {
        method: verb,
        timeout: 10000,
      });
      console.log('[Navigate] Navigation successful');
    } catch (error) {
      console.error('[Navigate] Error:', error);
      // Show error message if available
      const errorElement = context.getElementByID('error-message');
      if (errorElement) {
        errorElement.removeAttribute('hidden');
        errorElement.textContent = 'Navigation failed. Please try again.';
      }
    }
  },
};

export default [navigate];