import {
  Instance, SnapshotIn, SnapshotOut, types, IAnyModelType
} from "mobx-state-tree"
import { withSetPropAction } from "../_helpers/withSetPropAction"
import { log } from "@/utils/log"

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
const ChatStoreModel = types
  .model("ChatStore")
  .props({
    isInitialized: types.optional(types.boolean, false),
    error: types.maybeNull(types.string),
    messages: types.array(MessageModel),
    currentConversationId: types.optional(types.string, "default"),
    isGenerating: types.optional(types.boolean, false),
    activeModel: types.optional(types.enumeration(["groq", "gemini"]), "groq"),
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
    },

    setActiveModel(model: "groq" | "gemini") {
      self.activeModel = model
    }
  }))
  .views((self) => ({
    get currentMessages() {
      return self.messages
        .filter(msg => !msg.metadata?.conversationId || msg.metadata.conversationId === self.currentConversationId)
        .slice()
    }
  }))

export interface ChatStore extends Instance<typeof ChatStoreModel> { }
export interface ChatStoreSnapshotOut extends SnapshotOut<typeof ChatStoreModel> { }
export interface ChatStoreSnapshotIn extends SnapshotIn<typeof ChatStoreModel> { }

// Add Groq actions after ChatStore is defined to avoid circular dependency
import { withGroqActions } from "./ChatActions"

// Create a new model that includes the Groq actions
export const ChatStoreWithActions: IAnyModelType = types.compose(
  "ChatStoreWithActions",
  ChatStoreModel,
  types.model({})
    .actions(withGroqActions)
)

export const createChatStoreDefaultModel = () =>
  ChatStoreWithActions.create({
    isInitialized: false,
    error: null,
    messages: [],
    currentConversationId: "default",
    isGenerating: false,
    activeModel: "groq",
  })