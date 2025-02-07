import type { HvBehavior } from '@hyperview/core';
import Config from '@/config';

export const FetchBehavior: HvBehavior = {
  action: 'fetch',
  callback: async (element, context) => {
    console.log('[Fetch] Triggered');
    
    const href = element.getAttribute('href');
    console.log('[Fetch] href:', href);
    
    if (!href) {
      console.warn('[Fetch] No href attribute found');
      return;
    }

    const verb = element.getAttribute('verb') || 'GET';
    const showDuringLoad = element.getAttribute('show-during-load');
    const hideDuringLoad = element.getAttribute('hide-during-load');
    
    console.log('[Fetch] Loading states:', { showDuringLoad, hideDuringLoad });
    
    // Show/hide loading states
    if (showDuringLoad) {
      const showElement = context.getElementByID(showDuringLoad);
      if (showElement) {
        console.log('[Fetch] Showing loading element:', showDuringLoad);
        showElement.removeAttribute('hidden');
      }
    }

    if (hideDuringLoad) {
      const hideElement = context.getElementByID(hideDuringLoad);
      if (hideElement) {
        console.log('[Fetch] Hiding element:', hideDuringLoad);
        hideElement.setAttribute('hidden', 'true');
      }
    }

    try {
      // Construct full URL
      const fullUrl = href.startsWith('http') ? href : `${Config.API_URL}${href}`;
      console.log('[Fetch] Fetching URL:', fullUrl);
      
      const response = await fetch(fullUrl, {
        method: verb,
        headers: {
          'Accept': 'application/xml',
          'Content-Type': 'application/xml',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const xmlString = await response.text();
      console.log('[Fetch] Received response');
      
      // Update the screen with new XML
      await context.parser.update(xmlString);
      console.log('[Fetch] Updated screen content');
    } catch (error) {
      console.error('[Fetch] Error:', error);
      
      // Show error message if available
      const errorElement = context.getElementByID('error-message');
      if (errorElement) {
        errorElement.removeAttribute('hidden');
        errorElement.textContent = 'Request failed. Please try again.';
      }

      // Reset loading states
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