import { HvBehavior } from '@hyperview/core';
import { BASE_URL } from '../../constants';

export const NavigateBehavior: HvBehavior = {
  action: 'navigate',
  callback: async (element, context) => {
    const href = element.getAttribute('href');
    if (!href) return;

    const verb = element.getAttribute('verb') || 'GET';
    
    try {
      // Construct full URL
      const fullUrl = href.startsWith('http') ? href : `${BASE_URL}${href}`;
      
      // Use Hyperview's navigation system
      await context.navigation.navigate(fullUrl, {
        method: verb,
        timeout: 10000,
      });
    } catch (error) {
      // Show error message if available
      const errorElement = context.getElementByID('error-message');
      if (errorElement) {
        errorElement.removeAttribute('hidden');
        errorElement.textContent = 'Navigation failed. Please try again.';
      }
    }
  },
};