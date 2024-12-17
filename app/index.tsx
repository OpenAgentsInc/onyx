import { fetch as expoFetch } from "expo/fetch"
import { SafeAreaView, ScrollView, Text, TextInput, View } from "react-native"
import { typography } from "@/theme/typography"
import { generateAPIUrl } from "@/utils"
import { useChat } from "@ai-sdk/react"

export default function App() {
  // console.log("trying with chat endpoint", process.env.CHAT_ENDPOINT)
  const { messages, error, handleInputChange, input, handleSubmit } = useChat({
    fetch: (input, init) => {
      console.log("going to do this custom.", input)

      // return new dummy lpaceholder Response, no fetch, but make it a PRomise
      // return PromiseResponse.json("Bad Request", { status: 400 });

      return new Promise((resolve, reject) => {
        fetch("http://localhost:3000/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [{ "content": "Test", "createdAt": "2024-12-17T23:30:51.184Z", "experimental_attachments": undefined, "id": "asxCPGOEBLXL5cYk", "role": "user" }]
          }),
        })
          .then(res => res.json())
          .then(resolve)
          .catch(reject);
      })
    },
    // fetch: expoFetch as unknown as typeof globalThis.fetch,
    // api: generateAPIUrl('/api/chat'),
    // api: process.env.CHAT_ENDPOINT!,
    // api: "http://localhost:3000/api/chat",
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
