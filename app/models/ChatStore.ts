import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt?: Date | number
}

export const MessageModel = types.model("Message", {
  id: types.identifier,
  role: types.enumeration('Role', ['user', 'assistant']),
  content: types.string,
  createdAt: types.maybe(types.Date),
})

export const ChatStoreModel = types
  .model("ChatStore")
  .props({
    messages: types.array(MessageModel),
    showFullChat: types.optional(types.boolean, false),
  })
  .actions((store) => ({
    addMessage(message: Message) {
      store.messages.push(message)
    },
    setMessages(messages: Message[]) {
      store.messages.replace(messages)
    },
    clearMessages() {
      store.messages.clear()
    },
    toggleFullChat() {
      console.log("Toggling chat visibility")
      store.showFullChat = !store.showFullChat
    },
    setShowFullChat(value: boolean) {
      store.showFullChat = value
    }
  }))

export interface ChatStore extends Instance<typeof ChatStoreModel> {}
export interface ChatStoreSnapshotOut extends SnapshotOut<typeof ChatStoreModel> {}
export interface ChatStoreSnapshotIn extends SnapshotIn<typeof ChatStoreModel> {}