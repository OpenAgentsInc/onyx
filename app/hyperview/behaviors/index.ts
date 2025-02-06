import { Behavior } from 'hyperview/src/types'

const behaviors: Array<[string, Behavior]> = [
  ['hv-alert', (element, context) => {
    const message = element.getAttribute('message') || 'Alert'
    alert(message)
  }],
]

export default behaviors