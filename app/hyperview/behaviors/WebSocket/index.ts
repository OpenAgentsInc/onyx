import { WebSocketWrapper } from './wrapper';
import { parseHxmlFragment } from './parser';
import { SimpleEventEmitter } from './events';
import * as Dom from 'hyperview/src/services/dom';
import type {
  HvBehavior,
  HvComponentOnUpdate,
  HvGetRoot,
  HvUpdateRoot,
} from 'hyperview';

// Store active WebSocket connections
const connections = new Map<string, WebSocketWrapper>();

// Create event emitter for WebSocket events
const eventEmitter = new SimpleEventEmitter();

const wsConnect: HvBehavior = {
  action: 'ws:connect',
  callback: (
    element: Element,
    onUpdate: HvComponentOnUpdate,
    getRoot: HvGetRoot,
    updateRoot: HvUpdateRoot,
  ) => {
    const NAMESPACE_URI = 'https://openagents.com/hyperview-websocket';
    const wsUrl = element.getAttributeNS(NAMESPACE_URI, 'url');
    const wsProtocols = element.getAttributeNS(NAMESPACE_URI, 'protocols');
    
    if (!wsUrl) return;

    // Create unique connection ID for the element
    const connId = element.getAttribute('id') || Math.random().toString(36);
    
    // Create new WebSocket wrapper if doesn't exist
    if (!connections.has(connId)) {
      const ws = new WebSocketWrapper(wsUrl, wsProtocols?.split(','));
      connections.set(connId, ws);
      
      // Set up event handlers
      ws.on('open', () => {
        eventEmitter.emit('ws:open', { target: element });
      });
      
      ws.on('close', () => {
        eventEmitter.emit('ws:close', { target: element });
      });

      ws.on('auth_error', (error) => {
        eventEmitter.emit('ws:auth_error', { target: element, error });
      });
      
      ws.on('message', (data) => {
        // Parse HXML fragment and update target element
        const targetId = element.getAttributeNS(NAMESPACE_URI, 'target');
        const target = targetId ? 
          Dom.getElementById(getRoot(), targetId) :
          element;
          
        if (target) {
          const swap = element.getAttributeNS(NAMESPACE_URI, 'swap') || 'replace';
          parseHxmlFragment(data, target, swap as 'replace' | 'append' | 'prepend');
          updateRoot(getRoot(), true);
        }
      });
    }
  }
};

const wsSend: HvBehavior = {
  action: 'ws:send',
  callback: (
    element: Element,
    onUpdate: HvComponentOnUpdate,
    getRoot: HvGetRoot,
    updateRoot: HvUpdateRoot,
  ) => {
    const NAMESPACE_URI = 'https://openagents.com/hyperview-websocket';
    const wsMessage = element.getAttributeNS(NAMESPACE_URI, 'message');
    if (!wsMessage) return;
    
    // Get connection ID from element
    const connId = element.getAttribute('id') || '';
    const ws = connections.get(connId);
    
    if (ws) {
      ws.send(wsMessage);
    }
  }
};

const wsDisconnect: HvBehavior = {
  action: 'ws:disconnect',
  callback: (
    element: Element,
    onUpdate: HvComponentOnUpdate,
    getRoot: HvGetRoot,
    updateRoot: HvUpdateRoot,
  ) => {
    const connId = element.getAttribute('id') || '';
    const ws = connections.get(connId);
    
    if (ws) {
      ws.close();
      connections.delete(connId);
    }
  }
};

// Add event listeners for behavior triggers
eventEmitter.on('ws:open', (event) => {
  const behaviors = event.target.getElementsByTagName('behavior');
  if (behaviors) {
    Array.from(behaviors).forEach(behavior => {
      if (behavior.getAttribute('trigger') === 'ws:open') {
        const href = behavior.getAttribute('href');
        if (href) {
          // TODO: Handle navigation/loading new content
        }
      }
    });
  }
});

eventEmitter.on('ws:close', (event) => {
  const behaviors = event.target.getElementsByTagName('behavior');
  if (behaviors) {
    Array.from(behaviors).forEach(behavior => {
      if (behavior.getAttribute('trigger') === 'ws:close') {
        const href = behavior.getAttribute('href');
        if (href) {
          // TODO: Handle navigation/loading new content
        }
      }
    });
  }
});

eventEmitter.on('ws:auth_error', (event) => {
  const behaviors = event.target.getElementsByTagName('behavior');
  if (behaviors) {
    Array.from(behaviors).forEach(behavior => {
      if (behavior.getAttribute('trigger') === 'ws:auth_error') {
        const href = behavior.getAttribute('href');
        if (href) {
          // Navigate to login screen
          window.location.href = '/login';
        }
      }
    });
  }
});

export default [wsConnect, wsSend, wsDisconnect];