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

const initialMessages = [
  {
    id: 1,
    text: "Hello",
    user: "Alice",
  },
  {
    id: 2,
    text: "Hi",
    user: "Bob",
  },
]

export function ChatDemo() {
  const [value, setValue] = useState("")
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollViewRef = useRef<ScrollView>(null)

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const onChangeText = (text: string) => {
    setValue(text)
  }

  const handleSubmit = async (e?: any) => {
    if (e?.key === "Enter" || !e) {
      e?.preventDefault?.() // Prevent any default behavior
      if (value.trim()) {
        const newMessage: Message = {
          id: messages.length + 1,
          text: value.trim(),
          user: "You",
        }
        
        // Update messages and clear input
        setMessages(prev => [...prev, newMessage])
        setValue("")
        
        // Ensure input stays focused
        requestAnimationFrame(() => {
          inputRef.current?.focus()
        })
        
        // Scroll to bottom after message is added
        requestAnimationFrame(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true })
        })
      }
    }
  }

  return (
    <View style={styles.container}>
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
              <MessageComponent key={message.id} message={message} />
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
  )
}