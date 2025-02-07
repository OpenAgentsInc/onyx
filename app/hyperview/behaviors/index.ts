import { AddStyles } from './AddStyles';
import WebSocketBehaviors from './WebSocket';
import { OpenUrlBehavior } from './OpenUrl';

export default {
  'add-styles': AddStyles,
  'open-url': OpenUrlBehavior.callback,
  ...WebSocketBehaviors,
};