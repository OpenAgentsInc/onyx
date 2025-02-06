import { AddStyles } from './AddStyles'
import WebSocketBehavior from './WebSocket'

export default [
  AddStyles,
  ...Object.entries(WebSocketBehavior).map(([action, handler]) => ({
    action,
    handler
  }))
]