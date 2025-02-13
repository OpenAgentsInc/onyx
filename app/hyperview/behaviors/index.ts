import { Drawer } from "../components/Drawer/Drawer"
import { AddStyles } from "./AddStyles"
import { AuthBehavior } from "./Auth"
import { OpenUrlBehavior } from "./OpenUrl"
import WebSocketBehaviors from "./WebSocket"

// Convert drawer behavior registry to array format
const DrawerBehavior = {
  action: 'set-drawer-state',
  callback: (element: Element, args: any, context: any) => {
    console.log("DrawerBehavior callback", { element, args, context })
    // Find the nearest parent drawer element
    let current = element
    while (current && !(
      current.namespaceURI === 'https://openagents.com/hyperview-local' && 
      current.localName === 'drawer'
    )) {
      current = current.parentElement
      console.log("Traversing up:", current?.tagName, current?.namespaceURI, current?.localName)
    }
    
    if (current) {
      console.log("Found drawer element", current)
      return {
        action: 'set-drawer-state',
        state: element.getAttribute('state'),
      }
    } else {
      console.error("No drawer element found")
      return null
    }
  }
}

export default [
  AddStyles,
  ...WebSocketBehaviors,
  OpenUrlBehavior,
  AuthBehavior,
  DrawerBehavior,
]