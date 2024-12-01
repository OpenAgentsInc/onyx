import { fetch as expoFetch } from "expo/fetch"
import { observer } from "mobx-react-lite"
import { FC } from "react"
import { ScrollView, TextInput, View, ViewStyle } from "react-native"
import { Screen, Text } from "@/components"
import { AppStackScreenProps } from "@/navigators"
import { useChat } from "@ai-sdk/react"

// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "@/models"

interface ChatScreenProps extends AppStackScreenProps<"Chat"> { }


export const ChatScreen: FC<ChatScreenProps> = observer(function ChatScreen() {
  const { messages, error, handleInputChange, input, handleSubmit } = useChat({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: 'https://pro.openagents.com/api/chat-app',
    onError: error => console.error(error, 'ERROR'),
  });

  console.log('messages:', messages)

  if (error) return <Text>{error.message}</Text>;

  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()


  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root} preset="scroll">
      <View
        style={{
          height: '95%',
          display: 'flex',
          flexDirection: 'column',
          paddingHorizontal: 8,
        }}
      >
        <ScrollView style={{ flex: 1 }}>
          {messages.map(m => (
            <View key={m.id} style={{ marginVertical: 8 }}>
              <View>
                <Text style={{ fontWeight: 700 }}>{m.role}</Text>
                <Text>{m.content}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={{ marginTop: 8 }}>
          <TextInput
            style={{ backgroundColor: 'white', padding: 8 }}
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
              handleSubmit(e);
              e.preventDefault();
            }}
            autoFocus={true}
          />
        </View>
      </View>
    </Screen>
  )

})

const $root: ViewStyle = {
  flex: 1,
}
