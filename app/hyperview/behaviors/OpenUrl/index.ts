import { Linking } from 'react-native';
import type { HvBehavior } from '@hyperview/core';
import Config from '@/config';

export const OpenUrlBehavior: HvBehavior = {
  action: 'open-url',
  callback: async (element, context) => {
    console.log('[OpenUrl] Triggered');
    
    const href = element.getAttribute('href');
    console.log('[OpenUrl] href:', href);
    
    if (!href) {
      console.warn('[OpenUrl] No href attribute found');
      return;
    }

    // Show/hide elements during load
    const showDuringLoad = element.getAttribute('show-during-load');
    const hideDuringLoad = element.getAttribute('hide-during-load');

    console.log('[OpenUrl] Loading states:', { showDuringLoad, hideDuringLoad });

    try {
      // Construct full URL first before showing loading state
      const fullUrl = href.startsWith('http') ? href : `${Config.API_URL}${href}`;
      console.log('[OpenUrl] Opening URL:', fullUrl);

      // Show loading state only after URL is constructed
      if (showDuringLoad) {
        const showElement = document.getElementById(showDuringLoad);
        if (showElement) {
          console.log('[OpenUrl] Showing loading element:', showDuringLoad);
          showElement.style.display = 'flex';
        }
      }

      if (hideDuringLoad) {
        const hideElement = document.getElementById(hideDuringLoad);
        if (hideElement) {
          console.log('[OpenUrl] Hiding element:', hideDuringLoad);
          hideElement.style.display = 'none';
        }
      }
      
      // Now try to open the URL
      await Linking.openURL(fullUrl);
      console.log('[OpenUrl] URL opened successfully');
    } catch (error) {
      console.error('[OpenUrl] Error:', error);
      
      // Show error message if available
      const errorElement = document.getElementById('error-message');
      if (errorElement) {
        errorElement.style.display = 'flex';
        errorElement.textContent = `Failed to open GitHub login: ${error.message}`;
      }

      // Reset loading state
      if (showDuringLoad) {
        const showElement = document.getElementById(showDuringLoad);
        if (showElement) {
          showElement.style.display = 'none';
        }
      }

      if (hideDuringLoad) {
        const hideElement = document.getElementById(hideDuringLoad);
        if (hideElement) {
          hideElement.style.display = 'flex';
        }
      }
    }
  },
};