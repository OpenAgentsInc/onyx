import { AddStyles } from './AddStyles';
import WebSocketBehaviors from './WebSocket';
import { openUrl } from './OpenUrl';
import { navigate } from './Navigate';
import { fetch } from './Fetch';

// Export behaviors in the format Hyperview expects
export default {
  'open-url': openUrl.callback,
  'navigate': navigate.callback,
  'fetch': fetch.callback,
  ...WebSocketBehaviors,
};