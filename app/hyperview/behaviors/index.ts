import { AddStyles } from './AddStyles';
import WebSocketBehaviors from './WebSocket';
import { OpenUrlBehavior } from './OpenUrl';
import { AuthBehavior } from './Auth';
import { FetchBehavior } from './Fetch';

export default [
  AddStyles,
  ...WebSocketBehaviors,
  OpenUrlBehavior,
  AuthBehavior,
  FetchBehavior,
];