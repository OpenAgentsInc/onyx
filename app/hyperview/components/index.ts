import { HvComponent } from 'hyperview/src/types'

const HYPERVIEW_COMPONENTS: HvComponent[] = []

export class Registry {
  components: HvComponent[]

  constructor(components: HvComponent[] | null | undefined = null) {
    this.components = [...HYPERVIEW_COMPONENTS, ...(components || [])]
  }

  get(namespace: string, localName: string) {
    return this.components.find(
      c => c.namespaceURI === namespace && c.localName === localName
    )?.elementConstructor
  }
}