import { Drawer } from "../components/Drawer/Drawer"
import { AddStyles } from "./AddStyles"
import { AuthBehavior } from "./Auth"
import { OpenUrlBehavior } from "./OpenUrl"
import WebSocketBehaviors from "./WebSocket"

// Simple drawer behavior
const DrawerBehavior = {
  action: 'set-drawer-state',
  callback: (element: Element, args: any, context: any) => {
    console.log("DrawerBehavior callback starting")
    console.log("Initial element:", {
      localName: element.localName,
      namespaceURI: element.namespaceURI,
      parentNode: element.parentNode
    })

    // Find the nearest parent drawer element
    let current = element.parentNode as Element
    let depth = 0

    while (current && depth < 10) {
      console.log("Checking element:", {
        localName: current.localName,
        namespaceURI: current.namespaceURI,
        nodeName: current.nodeName,
        parentAvailable: !!current.parentNode
      })

      if (current.namespaceURI === 'https://openagents.com/hyperview-local' && 
          current.localName === 'drawer') {
        console.log("Found drawer!")
        break
      }

      current = current.parentNode as Element
      depth++
    }
    
    if (current && depth < 10) {
      console.log("Found drawer element at depth", depth)
      return {
        action: 'set-drawer-state',
        options: {
          behavior: {
            action: 'set-drawer-state',
            state: element.getAttribute('state')
          }
        }
      }
    } else {
      console.error("No drawer element found after checking", depth, "levels")
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