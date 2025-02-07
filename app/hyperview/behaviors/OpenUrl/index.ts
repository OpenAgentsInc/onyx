import { Linking } from 'react-native';
import { HvBehavior } from '@hyperview/core';
import Config from '@/config';

export const OpenUrlBehavior: HvBehavior = {
  action: 'open-url',
  callback: async (element, context) => {
    const href = element.getAttribute('href');
    if (!href) return;

    // Show/hide elements during load
    const showDuringLoad = element.getAttribute('show-during-load');
    const hideDuringLoad = element.getAttribute('hide-during-load');

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
      const fullUrl = href.startsWith('http') ? href : `${Config.API_URL}${href}`;
      await Linking.openURL(fullUrl);
    } catch (error) {
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