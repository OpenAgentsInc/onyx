import { AddStyles } from './AddStyles';
import WebSocketBehaviors from './WebSocket';
import { OpenUrlBehavior } from './OpenUrl';
import { NavigateBehavior } from './Navigate';
import { FetchBehavior } from './Fetch';

export default [
  AddStyles,
  ...WebSocketBehaviors,
  OpenUrlBehavior,
  NavigateBehavior,
  FetchBehavior,
];