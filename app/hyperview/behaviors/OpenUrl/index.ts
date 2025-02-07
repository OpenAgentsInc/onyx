import { Linking } from 'react-native';
import { HvBehavior } from '@hyperview/core';
import Config from '@/config';

export const OpenUrlBehavior: HvBehavior = {
  action: 'open-url',
  callback: async (element, context) => {
    console.log('[OpenUrlBehavior] Triggered');
    
    const href = element.getAttribute('href');
    console.log('[OpenUrlBehavior] href:', href);
    
    if (!href) {
      console.warn('[OpenUrlBehavior] No href attribute found');
      return;
    }

    // Show/hide elements during load
    const showDuringLoad = element.getAttribute('show-during-load');
    const hideDuringLoad = element.getAttribute('hide-during-load');

    console.log('[OpenUrlBehavior] Loading states:', { showDuringLoad, hideDuringLoad });

    if (showDuringLoad) {
      const showElement = context.getElementByID(showDuringLoad);
      if (showElement) {
        console.log('[OpenUrlBehavior] Showing loading element:', showDuringLoad);
        showElement.removeAttribute('hidden');
      }
    }

    if (hideDuringLoad) {
      const hideElement = context.getElementByID(hideDuringLoad);
      if (hideElement) {
        console.log('[OpenUrlBehavior] Hiding element:', hideDuringLoad);
        hideElement.setAttribute('hidden', 'true');
      }
    }

    try {
      // Construct full URL
      const fullUrl = href.startsWith('http') ? href : `${Config.API_URL}${href}`;
      console.log('[OpenUrlBehavior] Opening URL:', fullUrl);
      
      await Linking.openURL(fullUrl);
      console.log('[OpenUrlBehavior] URL opened successfully');
    } catch (error) {
      console.error('[OpenUrlBehavior] Error:', error);
      
      // Show error message if available
      const errorElement = context.getElementByID('error-message');
      if (errorElement) {
        errorElement.removeAttribute('hidden');
        errorElement.textContent = 'Failed to open GitHub login. Please try again.';
      }

      // Reset loading state
      if (showDuringLoad) {
        const showElement = context.getElementByID(showDuringLoad);
        if (showElement) {
          showElement.setAttribute('hidden', 'true');
        }
      }

      if (hideDuringLoad) {
        const hideElement = context.getElementByID(hideDuringLoad);
        if (hideElement) {
          hideElement.removeAttribute('hidden');
        }
      }
    }
  },
};