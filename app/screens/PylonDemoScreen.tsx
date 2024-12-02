import { observer } from "mobx-react-lite"
import { FC, useEffect, useState } from "react"
import { FlatList, TextStyle, View, ViewStyle } from "react-native"
import { Screen, Text } from "@/components"
import { AppStackScreenProps } from "@/navigators"
import { Api } from "@/services/api"
import { colors } from "@/theme"

interface PylonDemoScreenProps extends AppStackScreenProps<"PylonDemo"> { }

interface Thread {
  _id: string
  _creationTime: number
  user_id: string
  team_id: string
  messages: {
    _id: string
    text: string
    role: string
  }[]
}

interface ApiResponse {
  threads?: Thread[]
  error?: string
}

export const PylonDemoScreen: FC<PylonDemoScreenProps> = observer(function PylonDemoScreen() {
  const [status, setStatus] = useState<"loading" | "error" | "success">("loading")
  const [threads, setThreads] = useState<Thread[]>([])
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    const fetchThreads = async () => {
      const api = new Api({
        url: "https://pro.openagents.com",
        timeout: 10000,
      })

      try {
        const response = await api.apisauce.get<ApiResponse>("/api/threads", {}, {
          headers: {
            "x-app-secret": "temporary-secret-ijoi8j98j2"
          }
        })

        if (response.ok && response.data?.threads) {
          console.log("Setting threads:", response.data.threads.length)
          setThreads(response.data.threads)
          setStatus("success")
        } else {
          console.log("API error:", response.data)
          setStatus("error")
          setErrorMessage(response.data?.error || "Failed to fetch threads")
        }
      } catch (error) {
        console.error("API Error:", error)
        setStatus("error")
        setErrorMessage("Network error - Could not reach the API")
      }
    }

    fetchThreads()
  }, [])

  const renderThread = ({ item }: { item: Thread }) => {
    const lastMessage = item.messages?.[item.messages.length - 1]
    const date = new Date(item._creationTime).toLocaleDateString()

    return (
      <View style={$threadContainer}>
        <View style={$threadHeader}>
          <Text text={`Thread ${item._id.slice(0, 8)}...`} style={$threadId} />
          <Text text={date} style={$threadDate} />
        </View>
        {lastMessage && (
          <Text
            text={`${lastMessage.role}: ${lastMessage.text.slice(0, 100)}${lastMessage.text.length > 100 ? '...' : ''}`}
            style={$threadContent}
          />
        )}
        <Text text={`${item.messages?.length || 0} messages`} style={$messageCount} />
      </View>
    )
  }

  return (
    <Screen
      style={$screenContainer}
      contentContainerStyle={$contentContainer}
      preset="scroll"
    >
      <View style={$mainContainer}>
        <Text
          text="Team Threads"
          style={$headerText}
        />
        {status === "loading" ? (
          <Text text="Loading..." style={$centerText} />
        ) : status === "error" ? (
          <Text text={errorMessage} style={[$centerText, $errorText]} />
        ) : threads.length === 0 ? (
          <Text text="No threads found" style={$centerText} />
        ) : (
          <FlatList
            data={threads}
            renderItem={renderThread}
            keyExtractor={(item) => item._id}
            style={$listContainer}
            contentContainerStyle={$listContentContainer}
          />
        )}
      </View>
    </Screen>
  )
})

const $screenContainer: ViewStyle = {
  flex: 1,
  backgroundColor: "#09090b",
}

const $contentContainer: ViewStyle = {
  flex: 1,
  backgroundColor: "#09090b",
}

const $mainContainer: ViewStyle = {
  flex: 1,
  backgroundColor: "#09090b",
}

const $headerText: TextStyle = {
  fontSize: 24,
  fontWeight: "bold",
  textAlign: "center",
  marginVertical: 16,
  color: "#e4e4e7",
}

const $centerText: TextStyle = {
  textAlign: "center",
  marginTop: 20,
  color: "#e4e4e7",
}

const $errorText: TextStyle = {
  color: colors.error,
}

const $listContainer: ViewStyle = {
  flex: 1,
  backgroundColor: "#09090b",
  minHeight: 1, // Force FlatList to take space
}

const $listContentContainer: ViewStyle = {
  padding: 16,
  paddingBottom: 32,
}

const $threadContainer: ViewStyle = {
  backgroundColor: "#27272a",
  borderRadius: 8,
  padding: 16,
  marginBottom: 12,
  borderWidth: 1,
  borderColor: "#52525b",
}

const $threadHeader: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 8,
}

const $threadId: TextStyle = {
  fontSize: 16,
  fontWeight: "bold",
  color: "#e4e4e7",
}

const $threadDate: TextStyle = {
  fontSize: 14,
  color: "#a1a1aa",
}

const $threadContent: TextStyle = {
  fontSize: 14,
  color: "#e4e4e7",
  marginBottom: 8,
}

const $messageCount: TextStyle = {
  fontSize: 12,
  color: "#a1a1aa",
}