import { HvBehavior, BehaviorRegistry } from 'hyperview/src/types'

const HYPERVIEW_BEHAVIORS: HvBehavior[] = [
  {
    action: 'alert',
    callback: (element, context) => {
      const message = element.getAttribute('message') || 'Alert'
      alert(message)
    },
  },
]

export const getRegistry = (behaviors: HvBehavior[] = []): BehaviorRegistry =>
  [...HYPERVIEW_BEHAVIORS, ...behaviors].reduce(
    (registry: BehaviorRegistry, behavior: HvBehavior) => ({
      ...registry,
      [behavior.action]: behavior.callback,
    }),
    {},
  )

export {
  setIndicatorsBeforeLoad,
  performUpdate,
  setIndicatorsAfterLoad,
  isOncePreviouslyApplied,
  setRanOnce,
} from 'hyperview/src/services/behaviors'