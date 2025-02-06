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

export const getRegistry = (behaviors: HvBehavior[] = []): BehaviorRegistry => {
  console.log('HYPERVIEW_BEHAVIORS:', HYPERVIEW_BEHAVIORS)
  console.log('input behaviors:', behaviors)
  console.log('typeof HYPERVIEW_BEHAVIORS:', typeof HYPERVIEW_BEHAVIORS)
  console.log('HYPERVIEW_BEHAVIORS instanceof Array:', HYPERVIEW_BEHAVIORS instanceof Array)
  console.log('Array.isArray(HYPERVIEW_BEHAVIORS):', Array.isArray(HYPERVIEW_BEHAVIORS))
  
  // Try constructing the array explicitly
  const allBehaviors = Array.from(HYPERVIEW_BEHAVIORS).concat(Array.from(behaviors))
  console.log('allBehaviors:', allBehaviors)
  
  return allBehaviors.reduce(
    (registry: BehaviorRegistry, behavior: HvBehavior) => {
      console.log('reducing behavior:', behavior)
      return {
        ...registry,
        [behavior.action]: behavior.callback,
      }
    },
    {},
  )
}

export {
  setIndicatorsBeforeLoad,
  performUpdate,
  setIndicatorsAfterLoad,
  isOncePreviouslyApplied,
  setRanOnce,
} from 'hyperview/src/services/behaviors'