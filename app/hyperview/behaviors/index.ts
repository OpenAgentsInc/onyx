import { AddStyles } from './AddStyles';
import WebSocketBehaviors from './WebSocket';
import OpenUrlBehaviors from './OpenUrl';
import NavigateBehaviors from './Navigate';
import FetchBehaviors from './Fetch';

export default [
  AddStyles,
  ...WebSocketBehaviors,
  ...OpenUrlBehaviors,
  ...NavigateBehaviors,
  ...FetchBehaviors,
];