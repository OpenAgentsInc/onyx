import { useState, useEffect } from "react"
import { Pressable, View, TextInput, KeyboardAvoidingView, Platform, Keyboard } from "react-native"
import { AntDesign, FontAwesome } from "@expo/vector-icons"
import { typography } from "../theme/typography"

export const ChatBar = () => {
  const [expanded, setExpanded] = useState(false)
  
  useEffect(() => {
    const eventName = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'
    const keyboardListener = Keyboard.addListener(eventName, () => {
      setExpanded(false)
    })

    return () => {
      keyboardListener.remove()
    }
  }, [])

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
            maxHeight: expanded ? 300 : 40,
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
                maxLength={1000}
                style={{
                  color: "white",
                  fontSize: 16,
                  fontFamily: typography.primary.normal,
                  maxHeight: 240, // Max 10 lines approximately
                }}
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