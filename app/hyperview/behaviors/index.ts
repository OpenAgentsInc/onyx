import { AddStyles } from './AddStyles';
import WebSocketBehaviors from './WebSocket';
import { OpenUrlBehavior } from './OpenUrl';

export default [
  AddStyles,
  ...WebSocketBehaviors,
  OpenUrlBehavior,
];