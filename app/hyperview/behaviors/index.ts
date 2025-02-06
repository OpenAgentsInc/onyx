import { Behavior } from 'hyperview'

const behaviors: { [key: string]: Behavior } = {
  'hv-alert': (element, context) => {
    const message = element.getAttribute('message') || 'Alert'
    alert(message)
  },
}

export default behaviors