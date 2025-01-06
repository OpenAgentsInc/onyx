import { useState } from "react"
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
import { Text } from "@/components/ui/text"
import { colors } from "@/theme/colorsDark"

interface Message {
  id: number
  text: string
  user: string
}

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

function Message({ message }: { message: Message }) {
  return (
    <View style={{ marginVertical: 15 }}>
      <Text className="opacity-50">{message.user}</Text>
      <Text>{message.text}</Text>
    </View>
  )
}

export function ChatDemo() {
  const [value, setValue] = useState("")
  const [messages, setMessages] = useState<Message[]>(initialMessages)

  const onChangeText = (text: string) => {
    setValue(text)
  }

  const handleSubmit = (e?: any) => {
    if (e?.key === "Enter" || !e) {
      if (value.trim()) {
        const newMessage: Message = {
          id: messages.length + 1,
          text: value.trim(),
          user: "You",
        }
        setMessages([...messages, newMessage])
        setValue("")
      }
    }
  }

  return (
    <ScrollView
      style={{
        margin: 20,
        width: 400,
        height: 300,
        paddingVertical: 10,
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>UAP Sensemaking</CardTitle>
          <CardDescription>Nostr NIP-28 Chat Channel</CardDescription>
        </CardHeader>
        <CardContent>
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
        </CardContent>
        <CardFooter>
          <Input
            placeholder="Message"
            value={value}
            onChangeText={onChangeText}
            onKeyPress={handleSubmit}
            aria-labelledby="inputLabel"
            aria-errormessage="inputError"
          />
        </CardFooter>
      </Card>
    </ScrollView>
  )
}