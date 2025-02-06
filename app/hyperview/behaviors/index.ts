import { HvBehavior, BehaviorRegistry } from 'hyperview/src/types'

const HYPERVIEW_BEHAVIORS: Record<string, HvBehavior['callback']> = {
  alert: (element, context) => {
    const message = element.getAttribute('message') || 'Alert'
    alert(message)
  },
}

export const getRegistry = (behaviors: Record<string, HvBehavior['callback']> = {}): BehaviorRegistry => {
  console.log('Building registry with behaviors:', { ...HYPERVIEW_BEHAVIORS, ...behaviors })
  return {
    ...HYPERVIEW_BEHAVIORS,
    ...behaviors,
  }
}

export {
  setIndicatorsBeforeLoad,
  performUpdate,
  setIndicatorsAfterLoad,
  isOncePreviouslyApplied,
  setRanOnce,
} from 'hyperview/src/services/behaviors'