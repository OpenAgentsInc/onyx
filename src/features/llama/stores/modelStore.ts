import { LlamaContext } from "llama.rn"
import { makeAutoObservable } from "mobx"

export class ModelStore {
  context: LlamaContext | null = null

  constructor() {
    makeAutoObservable(this)
  }

  setContext(context: LlamaContext | null) {
    this.context = context
  }
}

export const modelStore = new ModelStore()