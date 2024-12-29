import { useEffect, useState } from "react"
import { Keyboard, Platform, Pressable, TextInput, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { colorsDark as colors } from "@/theme"
import { AntDesign, FontAwesome } from "@expo/vector-icons"
import { typography } from "../theme/typography"

export const ChatBar = () => {
  const [expanded, setExpanded] = useState(false)
  const [height, setHeight] = useState(24)
  const [text, setText] = useState("")

  const insets = useSafeAreaInsets()

  useEffect(() => {
    const eventName = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide"
    const keyboardListener = Keyboard.addListener(eventName, () => {
      setExpanded(false)
      setHeight(24)
    })

    return () => {
      keyboardListener.remove()
    }
  }, [])

  const updateSize = (event) => {
    const newHeight = Math.min(event.nativeEvent.contentSize.height, 240)
    setHeight(newHeight)
  }

  const handleMicPress = (e) => {
    e.stopPropagation()
    console.log("Mic pressed")
  }

  const handleSendPress = (e) => {
    e.stopPropagation()
    console.log("Send pressed")
  }

  return (
    <View
      style={{
        borderRadius: 20,
        marginHorizontal: 20,
        backgroundColor: colors.background,
        paddingBottom: 10,
        paddingHorizontal: 14,
        height: expanded ? Math.max(50, Math.min(height + 16, 300)) : 50,
        marginBottom: insets.bottom,
        zIndex: 4,
      }}
    >
      <Pressable
        onPress={() => setExpanded(true)}
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "flex-end",
        }}
      >
        <Pressable onPress={handleMicPress} style={{ marginRight: 16, paddingBottom: 5 }}>
          <FontAwesome name="microphone" size={20} color="#666" />
        </Pressable>

        {expanded ? (
          <TextInput
            autoFocus
            spellCheck={false}
            multiline
            style={{
              flex: 1,
              color: "white",
              fontSize: 16,
              fontFamily: typography.primary.normal,
              paddingBottom: 5,
            }}
            onContentSizeChange={updateSize}
            placeholder="Message"
            placeholderTextColor="#666"
            onChangeText={setText}
            value={text}
          />
        ) : (
          <TextInput
            pointerEvents="none"
            editable={false}
            style={{
              flex: 1,
              color: "white",
              fontSize: 16,
              fontFamily: typography.primary.normal,
              paddingBottom: 4,
            }}
            placeholder="Message"
            placeholderTextColor="#666"
            value={text}
          />
        )}

        <Pressable
          onPress={handleSendPress}
          style={{
            backgroundColor: text.trim() ? "white" : "transparent",
            borderRadius: 12,
            padding: 4,
            marginLeft: 12,
            marginBottom: 2,
          }}
        >
          <AntDesign name="arrowup" size={20} color={text.trim() ? "black" : "#666"} />
        </Pressable>
      </Pressable>
    </View>
  )
}
