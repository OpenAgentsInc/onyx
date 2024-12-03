import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"

export interface Message {
  id: string
  role: string
  content: string
}

export const MessageModel = types.model("Message", {
  id: types.identifier,
  role: types.string,
  content: types.string,
})

export const ChatStoreModel = types
  .model("ChatStore")
  .props({
    messages: types.array(MessageModel),
  })
  .actions((store) => ({
    addMessage(message: Message) {
      store.messages.push(message)
    },
    clearMessages() {
      store.messages.clear()
    },
  }))

export interface ChatStore extends Instance<typeof ChatStoreModel> {}
export interface ChatStoreSnapshotOut extends SnapshotOut<typeof ChatStoreModel> {}
export interface ChatStoreSnapshotIn extends SnapshotIn<typeof ChatStoreModel> {}