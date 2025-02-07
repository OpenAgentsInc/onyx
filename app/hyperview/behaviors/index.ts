import { AddStyles } from './AddStyles';
import WebSocketBehaviors from './WebSocket';
import { OpenUrlBehavior } from './OpenUrl';
import { NavigateBehavior } from './Navigate';
import { FetchBehavior } from './Fetch';

console.log('[Behaviors] Registering behaviors...');
console.log('[Behaviors] OpenUrlBehavior:', OpenUrlBehavior);
console.log('[Behaviors] NavigateBehavior:', NavigateBehavior);
console.log('[Behaviors] FetchBehavior:', FetchBehavior);

const behaviors = [
  AddStyles,
  ...WebSocketBehaviors,
  OpenUrlBehavior,
  NavigateBehavior,
  FetchBehavior,
];

console.log('[Behaviors] Final behaviors array:', behaviors);

export default behaviors;