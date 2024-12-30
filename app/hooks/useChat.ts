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
      chatStore.setIsGenerating(false)
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
        pendingToolInvocations.current = []
      }
    },
  })

  // Watch messages for tool invocations
  useEffect(() => {
    const lastMessage = aiMessages[aiMessages.length - 1]
    if (!lastMessage || !lastMessage.toolInvocations) return
    if (lastMessage?.role === "assistant" && lastMessage.toolInvocations?.length > 0) {
      // console.log("Found tool invocations:", lastMessage.toolInvocations)
      pendingToolInvocations.current = lastMessage.toolInvocations
    }
  }, [aiMessages])

  // Sync store messages with local state - with memoization to prevent unnecessary updates
  useEffect(() => {
    const storedMessages = chatStore.currentMessages
    const chatMessages = storedMessages.map((msg) => ({
      id: msg.id,
      role: msg.role as "user" | "assistant" | "system",
      content: msg.content,
      createdAt: new Date(msg.createdAt),
      ...(msg.metadata?.toolInvocations
        ? {
          toolInvocations: msg.metadata.toolInvocations,
        }
        : {}),
    }))

    // Only update if messages have actually changed
    if (JSON.stringify(chatMessages) !== JSON.stringify(localMessages)) {
      setLocalMessages(chatMessages)
    }
  }, [chatStore.currentMessages])

  // Load persisted messages when conversation changes - with cleanup
  useEffect(() => {
    let mounted = true

    const loadMessages = async () => {
      if (!mounted) return

      setMessages([])
      const storedMessages = chatStore.currentMessages
      if (storedMessages.length > 0) {
        const chatMessages = storedMessages.map((msg) => ({
          id: msg.id,
          role: msg.role as "user" | "assistant" | "system",
          content: msg.content,
          createdAt: new Date(msg.createdAt),
          ...(msg.metadata?.toolInvocations
            ? {
              toolInvocations: msg.metadata.toolInvocations,
            }
            : {}),
        }))
        if (mounted) {
          setMessages(chatMessages)
        }
      }
    }

    loadMessages()

    return () => {
      mounted = false
    }
  }, [chatStore.currentConversationId])

  const handleSendMessage = async (message: string) => {
    pendingToolInvocations.current = []

    chatStore.addMessage({
      role: "user",
      content: message,
      metadata: {
        conversationId: chatStore.currentConversationId,
      },
    })

    chatStore.setIsGenerating(true)

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
