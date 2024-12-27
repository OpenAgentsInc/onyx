import {
  applySnapshot, flow, Instance, onSnapshot, SnapshotIn, SnapshotOut, types
} from "mobx-state-tree"
import { log } from "@/utils/log"
import { withSetPropAction } from "../_helpers/withSetPropAction"
// Add Groq actions after ChatStore is defined to avoid circular dependency
import { withGroqActions } from "./ChatActions"
import { initializeDatabase, loadChat, saveChat } from "./ChatStorage"

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
  .actions((self) => {
    // Helper action to replace messages
    const replaceMessages = (messages: any[]) => {
      self.messages.clear()
      messages.forEach(msg => {
        self.messages.push(MessageModel.create(msg))
      })
    }

    // Helper action to load messages
    const loadMessagesFromStorage = flow(function* () {
      try {
        const savedMessages = yield loadChat(self.currentConversationId)
        const parsedMessages = JSON.parse(savedMessages)
        replaceMessages(parsedMessages)
      } catch (e) {
        log.error("Error loading chat:", e)
        self.messages.clear()
      }
    })

    return {
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

      setCurrentConversationId: flow(function* (id: string) {
        self.currentConversationId = id
        yield loadMessagesFromStorage()
      }),

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

      afterCreate: flow(function* () {
        try {
          // Initialize the database
          yield initializeDatabase()

          // Load initial conversation
          yield loadMessagesFromStorage()

          // Set up persistence listener
          onSnapshot(self.messages, (snapshot) => {
            saveChat(self.currentConversationId, JSON.stringify(snapshot))
              .catch(e => log.error("Error saving chat:", e))
          })
        } catch (e) {
          log.error("Error in afterCreate:", e)
        }
      })
    }
  })
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
