import { observer } from "mobx-react-lite"
import { FC, useEffect, useState } from "react"
import { TextStyle, View, ViewStyle, FlatList } from "react-native"
import { Screen, Text } from "@/components"
import { AppStackScreenProps } from "@/navigators"
import { Api } from "@/services/api"
import { colors } from "@/theme"

interface PylonDemoScreenProps extends AppStackScreenProps<"PylonDemo"> { }

interface Thread {
  _id: string
  title: string
  content: string
  // Add other thread properties as needed
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
        const response = await api.apisauce.get("/api/threads", {}, {
          headers: {
            "x-app-secret": "your-app-secret-here" // Replace with actual secret from env
          }
        })

        if (response.ok && response.data?.threads) {
          setStatus("success")
          setThreads(response.data.threads)
        } else {
          setStatus("error")
          setErrorMessage(response.data?.error || "Failed to fetch threads")
        }
      } catch (error) {
        setStatus("error")
        setErrorMessage("Network error - Could not reach the API")
      }
    }

    fetchThreads()
  }, [])

  const renderThread = ({ item }: { item: Thread }) => (
    <View style={$threadContainer}>
      <Text text={item.title} style={$threadTitle} />
      <Text text={item.content} style={$threadContent} />
    </View>
  )

  return (
    <Screen style={$contentContainer} preset="fixed">
      <Text
        text="Team Threads"
        style={$headerText}
      />
      {status === "loading" ? (
        <Text text="Loading..." />
      ) : status === "error" ? (
        <Text text={errorMessage} style={$errorText} />
      ) : (
        <FlatList
          data={threads}
          renderItem={renderThread}
          keyExtractor={(item) => item._id}
          style={$listContainer}
        />
      )}
    </Screen>
  )
})

const $contentContainer: ViewStyle = {
  flex: 1,
}

const $headerText: TextStyle = {
  fontSize: 24,
  fontWeight: "bold",
  textAlign: "center",
  marginVertical: 16,
}

const $errorText: TextStyle = {
  color: colors.error,
  textAlign: "center",
}

const $listContainer: ViewStyle = {
  flex: 1,
  padding: 16,
}

const $threadContainer: ViewStyle = {
  backgroundColor: colors.background,
  borderRadius: 8,
  padding: 16,
  marginBottom: 12,
  borderWidth: 1,
  borderColor: colors.border,
}

const $threadTitle: TextStyle = {
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 8,
}

const $threadContent: TextStyle = {
  fontSize: 14,
  color: colors.text,
}