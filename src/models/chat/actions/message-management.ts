import { IChatStore, IMessage } from "../types"

export const withMessageManagement = (self: IChatStore) => ({
  addMessage(message: Omit<IMessage, "id" | "timestamp">) {
    const id = Math.random().toString(36).substring(2, 9)
    const timestamp = Date.now()
    
    self.messages.push({
      ...message,
      id,
      timestamp,
    })
    
    return id
  },

  updateMessage(messageId: string, updates: Partial<IMessage>) {
    const message = self.messages.find(msg => msg.id === messageId)
    if (message) {
      Object.assign(message, updates)
    }
  },

  removeMessage(messageId: string) {
    const index = self.messages.findIndex(msg => msg.id === messageId)
    if (index >= 0) {
      self.messages.splice(index, 1)
    }
  },

  clearMessages() {
    self.messages.replace([])
  },

  setInferencing(value: boolean) {
    self.inferencing = value
  }
})