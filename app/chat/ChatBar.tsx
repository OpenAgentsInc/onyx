import { useState, useEffect } from "react"
import { Pressable, View, TextInput, KeyboardAvoidingView, Platform, Keyboard } from "react-native"
import { AntDesign, FontAwesome } from "@expo/vector-icons"
import { typography } from "../theme/typography"

export const ChatBar = () => {
  const [expanded, setExpanded] = useState(false)
  const [height, setHeight] = useState(24)
  
  useEffect(() => {
    const eventName = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: expanded ? 0 : 30,
      }}
    >
      <View
        style={{
          borderRadius: 20,
          marginHorizontal: 20,
          backgroundColor: "#111",
          padding: 10,
          height: expanded ? Math.min(height + 44, 300) : 40,
        }}
      >
        <Pressable onPress={() => setExpanded(true)} style={{ flex: 1 }}>
          {expanded ? (
            <>
              <TextInput
                autoFocus
                multiline
                style={{
                  color: "white",
                  fontSize: 16,
                  fontFamily: typography.primary.normal,
                  maxHeight: 240,
                }}
                onContentSizeChange={updateSize}
                placeholder="Type a message..."
                placeholderTextColor="#666"
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  height: 34,
                  paddingTop: 10,
                }}
              >
                <AntDesign name="plus" size={24} color="#666" />
                <FontAwesome name="microphone" size={24} color="#666" />
              </View>
            </>
          ) : null}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  )
}