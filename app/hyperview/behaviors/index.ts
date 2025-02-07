import { AddStyles } from './AddStyles';
import WebSocketBehaviors from './WebSocket';
import { OpenUrlBehavior } from './OpenUrl';
import { AuthBehavior } from './Auth';

export default [
  AddStyles,
  ...WebSocketBehaviors,
  OpenUrlBehavior,
  AuthBehavior,
];