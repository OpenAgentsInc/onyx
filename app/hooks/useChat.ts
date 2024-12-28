import { fetch as expoFetch } from "expo/fetch"
import { useEffect, useRef, useState } from "react"
import { useStores } from "@/models"
import { Message, useChat as useVercelChat } from "@ai-sdk/react"
import Config from "../config"

export function useChat() {
  const { chatStore, coderStore } = useStores()
  const pendingToolInvocations = useRef<any[]>([])
  const [localMessages, setLocalMessages] = useState<Message[]>([])

  const { isLoading, messages: aiMessages, error, append, setMessages } = useVercelChat({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: Config.NEXUS_URL,
    body: {
      // Only include GitHub token and tools if we have a token and at least one tool enabled
      ...(coderStore.githubToken &&
        chatStore.enabledTools.length > 0 && {
        githubToken: coderStore.githubToken,
        tools: chatStore.enabledTools,
        repos: coderStore.repos.map((repo) => ({
          owner: repo.owner,
          name: repo.name,
          branch: repo.branch,
        })),
      }),
    },
    onError: (error) => {
      console.error(error, "ERROR")
      chatStore.setError(error.message || "An error occurred")
    },
    onToolCall: async (toolCall) => {
      // console.log("TOOL CALL", toolCall)
    },
    onFinish: (message, options) => {
      // console.log("FINISH", { message, options })
      chatStore.setIsGenerating(false)

      // Add assistant message to store
      if (message.role === "assistant") {
        chatStore.addMessage({
          role: "assistant",
          content: message.content,
          metadata: {
            conversationId: chatStore.currentConversationId,
            usage: options.usage,
            finishReason: options.finishReason,
            toolInvocations: pendingToolInvocations.current,
          },
        })
        // Clear pending tool invocations
        pendingToolInvocations.current = []
      }
    },
  })

  // Watch messages for tool invocations
  useEffect(() => {
    const lastMessage = aiMessages[aiMessages.length - 1]
    // handle unfined
    if (!lastMessage || !lastMessage.toolInvocations) {
      return
    }
    if (lastMessage?.role === "assistant" && lastMessage.toolInvocations?.length > 0) {
      console.log("Found tool invocations:", lastMessage.toolInvocations)
      pendingToolInvocations.current = lastMessage.toolInvocations
    }
  }, [aiMessages])

  // Sync store messages with local state
  useEffect(() => {
    const storedMessages = chatStore.currentMessages
    const chatMessages: Message[] = storedMessages.map((msg) => ({
      id: msg.id,
      role: msg.role as "user" | "assistant" | "system",
      content: msg.content,
      createdAt: new Date(msg.createdAt),
      // Restore tool invocations if they exist
      ...(msg.metadata?.toolInvocations
        ? {
          toolInvocations: msg.metadata.toolInvocations,
        }
        : {}),
    }))
    setLocalMessages(chatMessages)
  }, [chatStore.currentMessages])

  // Load persisted messages when conversation changes
  useEffect(() => {
    const loadMessages = async () => {
      // First clear the useChat messages
      setMessages([])

      // Then load the persisted messages from store
      const storedMessages = chatStore.currentMessages
      if (storedMessages.length > 0) {
        // Convert store messages to useChat format
        const chatMessages: Message[] = storedMessages.map((msg) => ({
          id: msg.id,
          role: msg.role as "user" | "assistant" | "system",
          content: msg.content,
          createdAt: new Date(msg.createdAt),
          // Restore tool invocations if they exist
          ...(msg.metadata?.toolInvocations
            ? {
              toolInvocations: msg.metadata.toolInvocations,
            }
            : {}),
        }))
        setMessages(chatMessages)
      }
    }

    loadMessages()
  }, [chatStore.currentConversationId])


  const handleSendMessage = async (message: string) => {
    // Reset pending tool invocations for new message
    pendingToolInvocations.current = []

    // Add user message to store first
    chatStore.addMessage({
      role: "user",
      content: message,
      metadata: {
        conversationId: chatStore.currentConversationId,
      },
    })

    // Set generating state
    chatStore.setIsGenerating(true)

    // Send to AI
    await append({
      content: message,
      role: "user",
      createdAt: new Date(),
    })
  }

  return {
    handleSendMessage,
    isLoading,
    messages: localMessages,
  }
}
