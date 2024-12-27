import { fetch as expoFetch } from "expo/fetch"
import { observer } from "mobx-react-lite"
import React, { useState, useEffect } from "react"
import { View } from "react-native"
import { useChat, Message } from "@ai-sdk/react"
import Config from "../config"
import { useStores } from "../models/_helpers/useStores"
import { BottomButtons } from "./BottomButtons"
import { ChatOverlay } from "./ChatOverlay"
import { ConfigureModal } from "./ConfigureModal"
import { RepoSection } from "./repo/RepoSection"
import { TextInputModal } from "./TextInputModal"
import { VoiceInputModal } from "./VoiceInputModal"

// Available tools for the AI
const availableTools = ["view_file", "view_folder"]

export const OnyxLayout = observer(() => {
  const { chatStore, coderStore } = useStores()
  const [showTextInput, setShowTextInput] = useState(false)
  const [showVoiceInput, setShowVoiceInput] = useState(false)
  const [showConfigure, setShowConfigure] = useState(false)
  const [showRepos, setShowRepos] = useState(false)
  const [transcript, setTranscript] = useState("")

  const { isLoading, messages, error, append, setMessages } = useChat({
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
      console.log("TOOL CALL", toolCall)
    },
    onResponse: async (response: Response) => {
      console.log(response, "RESPONSE")
      try {
        const text = await response.text()
        console.log("Response text:", text)
        
        // Add assistant message to store
        chatStore.addMessage({
          role: "assistant",
          content: text,
          metadata: {
            conversationId: chatStore.currentConversationId,
          }
        })
      } catch (e) {
        console.error("Error handling response:", e)
      }
    },
    onFinish: () => {
      console.log("FINISH")
      chatStore.setIsGenerating(false)
    },
  })

  // Load persisted messages when conversation changes
  useEffect(() => {
    const loadMessages = async () => {
      // First clear the useChat messages
      setMessages([])
      
      // Then load the persisted messages from store
      const storedMessages = chatStore.currentMessages
      if (storedMessages.length > 0) {
        // Convert store messages to useChat format
        const chatMessages: Message[] = storedMessages.map(msg => ({
          id: msg.id,
          role: msg.role as "user" | "assistant" | "system",
          content: msg.content,
          createdAt: new Date(msg.createdAt)
        }))
        setMessages(chatMessages)
      }
    }
    
    loadMessages()
  }, [chatStore.currentConversationId])

  const handleStartVoiceInput = () => {
    setTranscript("") // Reset transcript
    setShowVoiceInput(true)
    // TODO: Start voice recording here
  }

  const handleStopVoiceInput = () => {
    // TODO: Stop voice recording here
    setShowVoiceInput(false)
    setTranscript("")
  }

  const handleSendMessage = async (message: string) => {
    // Add user message to store first
    chatStore.addMessage({
      role: "user",
      content: message,
      metadata: {
        conversationId: chatStore.currentConversationId,
      }
    })
    
    // Set generating state
    chatStore.setIsGenerating(true)
    
    // Send to AI
    await append({
      content: message,
      role: "user",
      createdAt: new Date()
    })
  }

  return (
    <View style={{ flex: 1, backgroundColor: "transparent" }}>
      <ChatOverlay messages={messages} isLoading={isLoading} error={error?.toString()} />

      <TextInputModal
        visible={showTextInput}
        onClose={() => setShowTextInput(false)}
        onSendMessage={handleSendMessage}
      />

      <VoiceInputModal
        visible={showVoiceInput}
        onClose={handleStopVoiceInput}
        transcript={transcript}
        onSendMessage={handleSendMessage}
      />

      <ConfigureModal visible={showConfigure} onClose={() => setShowConfigure(false)} />

      <RepoSection visible={showRepos} onClose={() => setShowRepos(false)} />

      <BottomButtons
        onTextPress={() => setShowTextInput(true)}
        onVoicePress={handleStartVoiceInput}
        onConfigurePress={() => setShowConfigure(true)}
        onReposPress={() => setShowRepos(true)}
        setMessages={setMessages}
      />
    </View>
  )
})