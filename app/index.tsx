import { fetch as expoFetch } from "expo/fetch"
import { SafeAreaView, ScrollView, Text, TextInput, View } from "react-native"
import { typography } from "@/theme/typography"
import { generateAPIUrl } from "@/utils"
import { useChat } from "@ai-sdk/react"

export default function App() {
  // console.log("trying with chat endpoint", process.env.CHAT_ENDPOINT)
  const { messages, error, handleInputChange, input, handleSubmit } = useChat({
    // fetch: expoFetch as unknown as typeof globalThis.fetch,
    // api: generateAPIUrl('/api/chat'),
    // api: "https://pro.openagents.com/api/chat-app",
    // api: process.env.CHAT_ENDPOINT!,
    api: "http://localhost:3000/api/chat",
    onError: error => console.error(error, 'ERROR'),
    // streamProtocol: 'text'
  });

  console.log(messages)

  if (error) return <Text style={{ color: "white", fontFamily: typography.primary.bold }}>{error.message}</Text>;

  return (
    <SafeAreaView style={{ height: '100%', backgroundColor: "black" }}>
      <View
        style={{
          height: '95%',
          display: 'flex',
          flexDirection: 'column',
          paddingHorizontal: 8,
          backgroundColor: "black",
        }}
      >
        <ScrollView style={{ flex: 1, backgroundColor: 'black' }}>
          {messages.map(m => (
            <View key={m.id} style={{ marginVertical: 8 }}>
              <View>
                <Text style={{
                  fontWeight: '700',
                  color: "white",
                  fontFamily: typography.primary.bold
                }}>
                  {m.role}
                </Text>
                <Text style={{
                  color: "white",
                  fontFamily: typography.primary.normal
                }}>
                  {m.content}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={{ marginTop: 8 }}>
          <TextInput
            style={{
              backgroundColor: 'white',
              padding: 8,
              fontFamily: typography.primary.normal
            }}
            placeholder="Say something..."
            value={input}
            onChange={e =>
              handleInputChange({
                ...e,
                target: {
                  ...e.target,
                  value: e.nativeEvent.text,
                },
              } as unknown as React.ChangeEvent<HTMLInputElement>)
            }
            onSubmitEditing={e => {
              console.log("submitting:", e.nativeEvent.text);
              handleSubmit(e);
              e.preventDefault();
            }}
            autoFocus={true}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
