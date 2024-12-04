import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system' | 'data'
  content: string
  createdAt?: Date | number
}

export const MessageModel = types.model("Message", {
  id: types.identifier,
  role: types.enumeration('Role', ['user', 'assistant', 'system', 'data']),
  content: types.string,
  createdAt: types.maybe(types.union(types.Date, types.number)),
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
    setMessages(messages: Array<{ id: string; role: string; content: string; createdAt?: Date | number }>) {
      // Filter out any messages with invalid roles
      const validMessages = messages.filter(msg => 
        ['user', 'assistant', 'system', 'data'].includes(msg.role)
      )
      store.messages.replace(validMessages)
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