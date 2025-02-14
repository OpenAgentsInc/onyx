import { AddStyles } from "./AddStyles"
import { AuthBehavior } from "./Auth"
import { OpenUrlBehavior } from "./OpenUrl"
import { SolveDemoRepoBehavior } from "./SolveDemoRepo"
import WebSocketBehaviors from "./WebSocket"

export default [
  AddStyles,
  ...WebSocketBehaviors,
  OpenUrlBehavior,
  AuthBehavior,
  SolveDemoRepoBehavior,
];
