import { Linking, Platform } from 'react-native';
import type { HvBehavior } from '@hyperview/core';
import Config from '@/config';

export const openUrl: HvBehavior = {
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

    if (showDuringLoad) {
      const showElement = context.getElementByID(showDuringLoad);
      if (showElement) {
        console.log('[OpenUrl] Showing loading element:', showDuringLoad);
        showElement.removeAttribute('hidden');
      }
    }

    if (hideDuringLoad) {
      const hideElement = context.getElementByID(hideDuringLoad);
      if (hideElement) {
        console.log('[OpenUrl] Hiding element:', hideDuringLoad);
        hideElement.setAttribute('hidden', 'true');
      }
    }

    try {
      // Construct full URL
      const fullUrl = href.startsWith('http') ? href : `${Config.API_URL}${href}`;
      console.log('[OpenUrl] Opening URL:', fullUrl);
      
      // Check if URL can be opened
      const canOpen = await Linking.canOpenURL(fullUrl);
      console.log('[OpenUrl] Can open URL:', canOpen);

      if (!canOpen) {
        throw new Error(`Cannot open URL: ${fullUrl}`);
      }

      // On iOS, we need to encode the URL
      const urlToOpen = Platform.OS === 'ios' ? encodeURI(fullUrl) : fullUrl;
      
      // Open URL
      await Linking.openURL(urlToOpen);
      console.log('[OpenUrl] URL opened successfully');
    } catch (error) {
      console.error('[OpenUrl] Error:', error);
      
      // Show error message if available
      const errorElement = context.getElementByID('error-message');
      if (errorElement) {
        errorElement.removeAttribute('hidden');
        errorElement.textContent = `Failed to open GitHub login: ${error.message}`;
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

export default [openUrl];