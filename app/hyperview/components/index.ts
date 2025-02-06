import { ComponentRegistry } from 'hyperview/src/types'

class Registry {
  private components: ComponentRegistry = {}

  constructor(customComponents: ComponentRegistry = {}) {
    this.components = {
      ...customComponents,
    }
  }

  get(namespace: string, localName: string) {
    const key = `${namespace}:${localName}`
    return this.components[key]
  }
}

export default Registry