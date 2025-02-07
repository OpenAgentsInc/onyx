import * as Linking from 'expo-linking';
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

      // Check if URL can be opened
      const canOpen = await Linking.canOpenURL(fullUrl);
      console.log('[OpenUrl] Can open URL:', canOpen);

      if (!canOpen) {
        throw new Error(`Cannot open URL: ${fullUrl}`);
      }

      // Show loading state
      if (showDuringLoad) {
        const loadingElement = element.ownerDocument.getElementById(showDuringLoad);
        if (loadingElement) {
          console.log('[OpenUrl] Showing loading element:', showDuringLoad);
          loadingElement.style.display = 'flex';
        }
      }

      if (hideDuringLoad) {
        const buttonElement = element.ownerDocument.getElementById(hideDuringLoad);
        if (buttonElement) {
          console.log('[OpenUrl] Hiding element:', hideDuringLoad);
          buttonElement.style.display = 'none';
        }
      }
      
      // Now try to open the URL
      await Linking.openURL(fullUrl);
      console.log('[OpenUrl] URL opened successfully');
    } catch (error) {
      console.error('[OpenUrl] Error:', error);
      
      // Show error message if available
      const errorElement = element.ownerDocument.getElementById('error-message');
      if (errorElement) {
        errorElement.style.display = 'flex';
        errorElement.textContent = `Failed to open GitHub login: ${error.message}`;
      }

      // Reset loading state
      if (showDuringLoad) {
        const loadingElement = element.ownerDocument.getElementById(showDuringLoad);
        if (loadingElement) {
          loadingElement.style.display = 'none';
        }
      }

      if (hideDuringLoad) {
        const buttonElement = element.ownerDocument.getElementById(hideDuringLoad);
        if (buttonElement) {
          buttonElement.style.display = 'flex';
        }
      }
    }
  },
};