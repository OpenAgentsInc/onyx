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
    console.log('[Navigate] verb:', verb);

    // Show/hide elements during load
    const showDuringLoad = element.getAttribute('show-during-load');
    const hideDuringLoad = element.getAttribute('hide-during-load');
    console.log('[Navigate] Loading states:', { showDuringLoad, hideDuringLoad });

    try {
      // Handle loading states first
      if (showDuringLoad) {
        const showElement = context.getElementByID(showDuringLoad);
        if (showElement) {
          console.log('[Navigate] Showing element:', showDuringLoad);
          showElement.setAttribute('display', 'flex');
          showElement.removeAttribute('hidden');
        } else {
          console.warn('[Navigate] Could not find element to show:', showDuringLoad);
        }
      }

      if (hideDuringLoad) {
        const hideElement = context.getElementByID(hideDuringLoad);
        if (hideElement) {
          console.log('[Navigate] Hiding element:', hideDuringLoad);
          hideElement.setAttribute('display', 'none');
        } else {
          console.warn('[Navigate] Could not find element to hide:', hideDuringLoad);
        }
      }

      // Construct full URL
      const fullUrl = href.startsWith('http') ? href : `${Config.API_URL}${href}`;
      console.log('[Navigate] Navigating to:', fullUrl);
      
      // Use Hyperview's navigation system
      const response = await context.navigation.navigate(fullUrl, {
        method: verb,
        timeout: 10000,
      });

      console.log('[Navigate] Navigation response:', response);
    } catch (error) {
      console.error('[Navigate] Error:', error);
      
      // Reset loading states
      if (showDuringLoad) {
        const showElement = context.getElementByID(showDuringLoad);
        if (showElement) {
          console.log('[Navigate] Hiding loading element:', showDuringLoad);
          showElement.setAttribute('display', 'none');
        }
      }

      if (hideDuringLoad) {
        const hideElement = context.getElementByID(hideDuringLoad);
        if (hideElement) {
          console.log('[Navigate] Showing button:', hideDuringLoad);
          hideElement.setAttribute('display', 'flex');
        }
      }

      // Show error message
      const errorElement = context.getElementByID('error-message');
      if (errorElement) {
        errorElement.setAttribute('display', 'flex');
        errorElement.textContent = `Navigation failed: ${error.message}`;
      }
    }
  },
};

export default [navigate];