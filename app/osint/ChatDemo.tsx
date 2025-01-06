import { useEffect, useRef, useState } from "react"
import { ScrollView, View } from "react-native"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Message as MessageComponent } from "./components/Message"
import { Message } from "./types"
import { styles } from "./styles"
import { typography } from "@/theme"
import { Text } from "@/components/ui/text"
import { OSINTEvent, relatedOSINTEvents } from "./data"
import { Inspector3D } from "./components/Inspector3D"

const initialMessages = [
  {
    id: 1,
    text: "Hello, let's discuss the drone sightings from last night.",
    user: "Alice",
    osintData: relatedOSINTEvents[0]
  },
  {
    id: 2,
    text: "I've got some interesting data about government involvement.",
    user: "Bob",
    osintData: relatedOSINTEvents[1]
  },
]

export function ChatDemo() {
  const [value, setValue] = useState("")
  const [messages, setMessages] = useState<(Message & { osintData?: OSINTEvent })[]>(initialMessages)
  const [selectedItem, setSelectedItem] = useState<OSINTEvent | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
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
        setMessages(prev => [...prev, newMessage])
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
    <View style={{ 
      flexDirection: "row", 
      height: "100vh",
      padding: 20,
      gap: 20,
    }}>
      {/* Chat Panel */}
      <View style={{ flex: 1 }}>
        <Card style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <CardHeader>
            <CardTitle>UAP Sensemaking</CardTitle>
            <CardDescription>Nostr NIP-28 Chat Channel</CardDescription>
          </CardHeader>
          <CardContent style={styles.messagesContainer}>
            <ScrollView 
              ref={scrollViewRef}
              style={styles.scrollView}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              {messages.map((message) => (
                <View 
                  key={message.id}
                  onClick={() => message.osintData && setSelectedItem(message.osintData)}
                  style={{ cursor: message.osintData ? 'pointer' : 'default' }}
                >
                  <MessageComponent message={message} />
                  {message.osintData && (
                    <Text className="text-xs opacity-50 ml-4 mb-4">
                      Click to inspect OSINT data
                    </Text>
                  )}
                </View>
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
                fontFamily: typography.primary.normal 
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