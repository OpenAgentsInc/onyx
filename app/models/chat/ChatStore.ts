import {
  Instance, IStateTreeNode, SnapshotIn, SnapshotOut, types
} from "mobx-state-tree"
import { withSetPropAction } from "../_helpers/withSetPropAction"
import { log } from "@/utils/log"
import { withGroqActions } from "./ChatActions"

// Message Types
export const MessageModel = types
  .model("Message", {
    id: types.string,
    role: types.enumeration(["system", "user", "assistant"]),
    content: types.string,
    createdAt: types.number,
    metadata: types.optional(types.frozen(), {}),
  })
  .actions(self => ({
    updateContent(content: string) {
      self.content = content
    },
    updateMetadata(metadata: any) {
      self.metadata = metadata
    }
  }))

export interface IMessage extends Instance<typeof MessageModel> { }

// Store Model
export const ChatStoreModel = types
  .model("ChatStore")
  .props({
    isInitialized: types.optional(types.boolean, false),
    error: types.maybeNull(types.string),
    messages: types.array(MessageModel),
    currentConversationId: types.optional(types.string, "default"),
    isGenerating: types.optional(types.boolean, false),
  })
  .actions(withSetPropAction)
  .actions((self) => ({
    addMessage(message: {
      role: "system" | "user" | "assistant"
      content: string
      metadata?: any
    }) {
      const msg = MessageModel.create({
        id: Math.random().toString(36).substring(2, 9),
        createdAt: Date.now(),
        ...message
      })
      self.messages.push(msg)
      return msg
    },

    updateMessage(messageId: string, updates: { content?: string, metadata?: any }) {
      const message = self.messages.find(msg => msg.id === messageId)
      if (message) {
        if (updates.content !== undefined) {
          message.updateContent(updates.content)
        }
        if (updates.metadata !== undefined) {
          message.updateMetadata(updates.metadata)
        }
      }
    },

    clearMessages() {
      self.messages.clear()
    },

    setCurrentConversationId(id: string) {
      self.currentConversationId = id
    },

    setIsGenerating(value: boolean) {
      self.isGenerating = value
    },

    setError(error: string | null) {
      self.error = error
    }
  }))
  .views((self) => ({
    get currentMessages() {
      return self.messages
        .filter(msg => !msg.metadata?.conversationId || msg.metadata.conversationId === self.currentConversationId)
        .slice()
    }
  }))
  .extend(withGroqActions) // Add Groq actions

export interface ChatStore extends Instance<typeof ChatStoreModel> { }
export interface ChatStoreSnapshotOut extends SnapshotOut<typeof ChatStoreModel> { }
export interface ChatStoreSnapshotIn extends SnapshotIn<typeof ChatStoreModel> { }

export const createChatStoreDefaultModel = () =>
  ChatStoreModel.create({
    isInitialized: false,
    error: null,
    messages: [],
    currentConversationId: "default",
    isGenerating: false,
  })

// Types
export interface IChatStore extends IStateTreeNode {
  isInitialized: boolean
  error: string | null
  messages: IMessage[]
  currentConversationId: string
  isGenerating: boolean
  addMessage: (message: { role: "system" | "user" | "assistant", content: string, metadata?: any }) => IMessage
  updateMessage: (messageId: string, updates: { content?: string, metadata?: any }) => void
  clearMessages: () => void
  setCurrentConversationId: (id: string) => void
  setIsGenerating: (value: boolean) => void
  setError: (error: string | null) => void
  sendMessage: (content: string) => Promise<void>
  sendStreamingMessage: (content: string) => Promise<void>
}