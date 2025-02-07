import { AddStyles } from './AddStyles';
import WebSocketBehaviors from './WebSocket';
import { OpenUrlBehavior } from './OpenUrl';
import { AuthBehavior } from './Auth';
import { fetchWrapper } from '../helpers';
import type { HvBehavior } from '@hyperview/core';

const FetchBehavior: HvBehavior = {
  action: 'fetch',
  callback: async (behaviorElement, onUpdate) => {
    console.log('[Fetch] Behavior triggered');
    
    const href = behaviorElement.getAttribute('href');
    const verb = behaviorElement.getAttribute('verb') || 'GET';
    const target = behaviorElement.getAttribute('target');
    
    console.log('[Fetch] Href:', href);
    console.log('[Fetch] Verb:', verb);
    console.log('[Fetch] Target:', target);

    if (!href || !target) {
      console.error('[Fetch] Missing required attributes');
      return;
    }

    try {
      const response = await fetchWrapper(href, {
        method: verb,
      });

      console.log('[Fetch] Response status:', response.status);
      
      if (response.ok) {
        const targetElement = behaviorElement.ownerDocument?.getElementById(target);
        if (targetElement) {
          onUpdate(targetElement, { xml: await response.text() });
        } else {
          console.error('[Fetch] Target element not found:', target);
        }
      } else {
        console.error('[Fetch] Request failed:', response.status);
      }
    } catch (error) {
      console.error('[Fetch] Error:', error);
    }
  },
};

export default [
  AddStyles,
  ...WebSocketBehaviors,
  OpenUrlBehavior,
  AuthBehavior,
  FetchBehavior,
];