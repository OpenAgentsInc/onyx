import * as Linking from 'expo-linking';
import type { HvBehavior } from '@hyperview/core';
import * as Dom from 'hyperview/src/services/dom';
import Config from '@/config';

export const OpenUrlBehavior: HvBehavior = {
  action: 'open-url',
  callback: async (element, _onUpdate, getRoot) => {
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

      // Get root element for DOM operations
      const root = getRoot();
      console.log('[OpenUrl] Got root element');

      // Show loading state
      if (showDuringLoad) {
        const loadingElement = Dom.getElementById(root, showDuringLoad);
        if (loadingElement) {
          console.log('[OpenUrl] Showing loading element:', showDuringLoad);
          loadingElement.removeAttribute('hidden');
        } else {
          console.warn('[OpenUrl] Loading element not found:', showDuringLoad);
        }
      }

      if (hideDuringLoad) {
        const buttonElement = Dom.getElementById(root, hideDuringLoad);
        if (buttonElement) {
          console.log('[OpenUrl] Hiding element:', hideDuringLoad);
          buttonElement.setAttribute('hidden', 'true');
        } else {
          console.warn('[OpenUrl] Button element not found:', hideDuringLoad);
        }
      }
      
      // Now try to open the URL
      await Linking.openURL(fullUrl);
      console.log('[OpenUrl] URL opened successfully');
    } catch (error) {
      console.error('[OpenUrl] Error:', error);
      
      const root = getRoot();

      // Show error message if available
      const errorElement = Dom.getElementById(root, 'error-message');
      if (errorElement) {
        errorElement.removeAttribute('hidden');
        errorElement.textContent = `Failed to open GitHub login: ${error.message}`;
      }

      // Reset loading state
      if (showDuringLoad) {
        const loadingElement = Dom.getElementById(root, showDuringLoad);
        if (loadingElement) {
          loadingElement.setAttribute('hidden', 'true');
        }
      }

      if (hideDuringLoad) {
        const buttonElement = Dom.getElementById(root, hideDuringLoad);
        if (buttonElement) {
          buttonElement.removeAttribute('hidden');
        }
      }
    }
  },
};