import {
  applySnapshot, Instance, onSnapshot, SnapshotIn, SnapshotOut, types
} from "mobx-state-tree"
import { log } from "@/utils/log"
import { withSetPropAction } from "../_helpers/withSetPropAction"
// Add Groq actions after ChatStore is defined to avoid circular dependency
import { withGroqActions } from "./ChatActions"
import { loadChat, saveChat, initializeDatabase } from "./ChatStorage"

// Message Types
export const MessageModel = types
  .model("Message", {
    id: types.string,
    role: types.enumeration(["system", "user", "assistant", "function"]),
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
    activeModel: types.optional(types.enumeration(["groq", "gemini"]), "gemini"),
    enabledTools: types.optional(types.array(types.string), [
      "view_file",
      "view_folder",
      "create_file",
      "rewrite_file"
    ]),
  })
  .actions(withSetPropAction)
  .actions((self) => ({
    addMessage(message: {
      role: "system" | "user" | "assistant" | "function"
      content: string
      metadata?: any
    }) {
      const msg = MessageModel.create({
        id: Math.random().toString(36).substring(2, 9),
        createdAt: Date.now(),
        ...message,
        metadata: {
          ...message.metadata,
          conversationId: self.currentConversationId,
        }
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
          message.updateMetadata({
            ...updates.metadata,
            conversationId: self.currentConversationId,
          })
        }
      }
    },

    clearMessages() {
      self.messages.clear()
    },

    setCurrentConversationId(id: string) {
      self.currentConversationId = id
      // Load messages for this conversation
      loadChat(id).then(savedMessages => {
        try {
          const parsedMessages = JSON.parse(savedMessages)
          self.messages.clear()
          applySnapshot(self.messages, parsedMessages)
        } catch (e) {
          log.error("Error parsing saved messages:", e)
          self.messages.clear() // Clear messages if there's an error
        }
      }).catch(e => {
        log.error("Error loading chat:", e)
        self.messages.clear() // Clear messages if there's an error
      })
    },

    setIsGenerating(value: boolean) {
      self.isGenerating = value
    },

    setError(error: string | null) {
      self.error = error
    },

    setActiveModel(model: "groq" | "gemini") {
      self.activeModel = model
    },

    toggleTool(toolName: string) {
      const index = self.enabledTools.indexOf(toolName)
      if (index === -1) {
        self.enabledTools.push(toolName)
      } else {
        self.enabledTools.splice(index, 1)
      }
    },

    setEnabledTools(tools: string[]) {
      self.enabledTools.replace(tools)
    },
  }))
  .views((self) => {
    const filteredMessages = () => {
      return self.messages
        .filter(msg => !msg.metadata?.conversationId || msg.metadata.conversationId === self.currentConversationId)
        .slice()
    }

    return {
      get currentMessages() {
        return filteredMessages()
      },
      get conversationText() {
        return filteredMessages()
          .map((msg: IMessage) => msg.content)
          .join('\n\n')
      },
      isToolEnabled(toolName: string) {
        return self.enabledTools.includes(toolName)
      }
    }
  })
  .actions(self => ({
    afterCreate() {
      // Initialize the database
      initializeDatabase().catch(e => {
        log.error("Error initializing database:", e)
      })

      // Load initial conversation
      self.setCurrentConversationId(self.currentConversationId)

      // Set up persistence listener
      onSnapshot(self.messages, (snapshot) => {
        saveChat(self.currentConversationId, JSON.stringify(snapshot))
          .catch(e => log.error("Error saving chat:", e))
      })
    }
  }))

export interface ChatStore extends Instance<typeof ChatStoreModel> { }
export interface ChatStoreSnapshotOut extends SnapshotOut<typeof ChatStoreModel> { }
export interface ChatStoreSnapshotIn extends SnapshotIn<typeof ChatStoreModel> { }

// Create a new model that includes the Groq actions
export const ChatStoreWithActions = types.compose(
  "ChatStoreWithActions",
  ChatStoreModel,
  types.model({})
).actions(self => withGroqActions(self as ChatStore))

export const createChatStoreDefaultModel = () =>
  ChatStoreWithActions.create({
    isInitialized: false,
    error: null,
    messages: [],
    currentConversationId: "default",
    isGenerating: false,
    activeModel: "gemini",
    enabledTools: ["view_file", "view_folder", "create_file", "rewrite_file"],
  })