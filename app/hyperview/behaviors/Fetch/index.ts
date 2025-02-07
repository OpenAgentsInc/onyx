import { HvBehavior } from '@hyperview/core';
import { BASE_URL } from '../../constants';

export const FetchBehavior: HvBehavior = {
  action: 'fetch',
  callback: async (element, context) => {
    const href = element.getAttribute('href');
    if (!href) return;

    const verb = element.getAttribute('verb') || 'GET';
    const showDuringLoad = element.getAttribute('show-during-load');
    const hideDuringLoad = element.getAttribute('hide-during-load');
    
    // Show/hide loading states
    if (showDuringLoad) {
      const showElement = context.getElementByID(showDuringLoad);
      if (showElement) {
        showElement.removeAttribute('hidden');
      }
    }

    if (hideDuringLoad) {
      const hideElement = context.getElementByID(hideDuringLoad);
      if (hideElement) {
        hideElement.setAttribute('hidden', 'true');
      }
    }

    try {
      // Construct full URL
      const fullUrl = href.startsWith('http') ? href : `${BASE_URL}${href}`;
      
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
      
      // Update the screen with new XML
      await context.parser.update(xmlString);
    } catch (error) {
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