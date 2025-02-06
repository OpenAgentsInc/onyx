import { Behavior } from 'hyperview/src/types'

const behaviors: Record<string, Behavior> = {
  'hv-alert': (element, context) => {
    const message = element.getAttribute('message') || 'Alert'
    alert(message)
  },
}

export const getRegistry = (customBehaviors: Record<string, Behavior> = {}) => ({
  ...behaviors,
  ...customBehaviors,
})