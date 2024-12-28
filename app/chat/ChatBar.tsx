import { useState, useEffect } from "react"
import { Pressable, View, TextInput, KeyboardAvoidingView, Platform, Keyboard } from "react-native"
import { AntDesign, FontAwesome } from "@expo/vector-icons"
import { typography } from "../theme/typography"

export const ChatBar = () => {
  const [expanded, setExpanded] = useState(false)
  const [height, setHeight] = useState(0)
  
  useEffect(() => {
    const eventName = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'
    const keyboardListener = Keyboard.addListener(eventName, () => {
      setExpanded(false)
      setHeight(0)
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
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <Pressable onPress={() => setExpanded(true)}>
        <View
          style={{
            minHeight: expanded ? 80 : 40,
            maxHeight: expanded ? (height + 80) : 40,
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
                  minHeight: 24,
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
                  marginTop: 10,
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