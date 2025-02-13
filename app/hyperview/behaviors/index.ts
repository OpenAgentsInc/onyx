import { Drawer } from "../components/Drawer/Drawer"
import { AddStyles } from "./AddStyles"
import { AuthBehavior } from "./Auth"
import { OpenUrlBehavior } from "./OpenUrl"
import WebSocketBehaviors from "./WebSocket"

// Convert drawer behavior registry to array format
const DrawerBehavior = {
  action: 'set-drawer-state',
  callback: (element: Element, args: any) => ({
    action: 'set-drawer-state',
    state: element.getAttribute('state'),
  })
}

export default [
  AddStyles,
  ...WebSocketBehaviors,
  OpenUrlBehavior,
  AuthBehavior,
  DrawerBehavior,
]
