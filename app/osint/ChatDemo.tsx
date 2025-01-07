import { useEffect, useRef, useState } from "react"
import { Platform, Pressable, ScrollView, TextInput, View, ViewStyle } from "react-native"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Text } from "@/components/ui/text"
import { typography } from "@/theme"
import { Inspector3D } from "./components/Inspector3D"
import { Message as MessageComponent } from "./components/Message"
import { OSINTEvent, relatedOSINTEvents } from "./data"
import { styles } from "./styles"
import { Message } from "./types"

const initialMessages = [
  {
    id: 1,
    text: "Let's analyze the claims made in the Shawn Ryan Show interview with Sam Shoemate.",
    user: "Alice",
    osintData: relatedOSINTEvents[0],
  },
  {
    id: 2,
    text: "I've found some technical inconsistencies in the email authentication claims.",
    user: "Bob",
    osintData: relatedOSINTEvents[1],
  },
  {
    id: 3,
    text: "The drone technology claims seem to contradict known physics principles.",
    user: "Charlie",
    osintData: relatedOSINTEvents[2],
  }
]

const getMessageStyle = (hasOsintData: boolean): ViewStyle => {
  if (Platform.OS === "web") {
    return {
      cursor: hasOsintData
        ? ("pointer" as ViewStyle["cursor"])
        : ("default" as ViewStyle["cursor"]),
    }
  }
  return {}
}

export function ChatDemo() {
  const [value, setValue] = useState("")
  const [messages, setMessages] =
    useState<(Message & { osintData?: OSINTEvent })[]>(initialMessages)
  const [selectedItem, setSelectedItem] = useState<OSINTEvent | null>(null)
  const inputRef = useRef<TextInput>(null)
  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const onChangeText = (text: string) => {
    setValue(text)
  }

  const handleSubmit = async (e?: any) => {
    if (e?.key === "Enter" || !e) {
      e?.preventDefault?.()
      if (value.trim()) {
        const newMessage = {
          id: messages.length + 1,
          text: value.trim(),
          user: "You",
        }
        setMessages((prev) => [...prev, newMessage])
        setValue("")

        requestAnimationFrame(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true })
        })

        requestAnimationFrame(() => {
          inputRef.current?.focus()
        })
      }
    }
  }

  return (
    <View
      style={{
        flexDirection: "row",
        flex: 1,
        padding: 20,
        gap: 20,
      }}
    >
      {/* Chat Panel */}
      <View style={{ flex: 1 }}>
        <Card style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <CardHeader>
            <CardTitle>Claim Analysis</CardTitle>
            <CardDescription>Shawn Ryan Show - Sam Shoemate Interview</CardDescription>
          </CardHeader>
          <CardContent style={styles.messagesContainer}>
            <ScrollView
              ref={scrollViewRef}
              style={styles.scrollView}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              {messages.map((message) => (
                <Pressable
                  key={message.id}
                  onPress={() => setSelectedItem(message.osintData || null)}
                  style={getMessageStyle(!!message.osintData)}
                >
                  <MessageComponent message={message} />
                  {message.osintData && (
                    <Text className="text-xs opacity-50 ml-4 mb-4">
                      Click to inspect OSINT data
                    </Text>
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </CardContent>
          <CardFooter style={styles.inputContainer}>
            <Input
              ref={inputRef}
              placeholder="Message"
              value={value}
              onChangeText={onChangeText}
              onKeyPress={handleSubmit}
              aria-labelledby="inputLabel"
              aria-errormessage="inputError"
              style={{
                borderWidth: 0,
                fontFamily: typography.primary.normal,
              }}
            />
          </CardFooter>
        </Card>
      </View>

      {/* Inspector Panel */}
      <View style={{ flex: 1 }}>
        <Inspector3D selectedItem={selectedItem} />
      </View>
    </View>
  )
}