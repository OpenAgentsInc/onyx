import { useState, useEffect } from "react"
import { Pressable, View, TextInput, KeyboardAvoidingView, Platform, Keyboard, EmitterSubscription } from "react-native"
import { AntDesign, FontAwesome } from "@expo/vector-icons"
import { typography } from "../theme/typography"

export const ChatBar = () => {
  const [expanded, setExpanded] = useState(false)
  const [inputHeight, setInputHeight] = useState(24) // Initial height for one line
  
  useEffect(() => {
    const eventName = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'
    const keyboardListener = Keyboard.addListener(eventName, () => {
      setExpanded(false)
      setInputHeight(24) // Reset height when collapsed
    })

    return () => {
      keyboardListener.remove()
    }
  }, [])

  const onContentSizeChange = (event) => {
    const height = event.nativeEvent.contentSize.height
    // Cap the height at approximately 10 lines (24px per line)
    setInputHeight(Math.min(height, 240))
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: expanded ? 140 : 70,
      }}
    >
      <Pressable onPress={() => setExpanded(true)}>
        <View
          style={{
            minHeight: expanded ? 80 : 40,
            maxHeight: expanded ? 296 : 40, // 296 = 240 (max text) + padding + icons
            borderRadius: 20,
            marginBottom: expanded ? 0 : 30,
            marginLeft: 20,
            marginRight: 20,
            backgroundColor: "#111",
            padding: 10,
          }}
        >
          {expanded ? (
            <View style={{ flex: 1 }}>
              <TextInput
                autoFocus
                multiline
                style={{
                  color: "white",
                  fontSize: 16,
                  fontFamily: typography.primary.normal,
                  height: inputHeight,
                }}
                placeholder="Type a message..."
                placeholderTextColor="#666"
                onContentSizeChange={onContentSizeChange}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: 10,
                }}
              >
                <AntDesign name="plus" size={24} color="#666" />
                <FontAwesome name="microphone" size={24} color="#666" />
              </View>
            </View>
          ) : null}
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  )
}