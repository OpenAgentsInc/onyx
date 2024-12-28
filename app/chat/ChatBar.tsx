import { useEffect, useState } from "react"
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, TextInput, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { AntDesign, FontAwesome } from "@expo/vector-icons"
import { typography } from "../theme/typography"

export const ChatBar = () => {
  const [expanded, setExpanded] = useState(false)
  const [height, setHeight] = useState(24)

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
    console.log("Microphone pressed")
  }

  const handlePlusPress = (e) => {
    e.stopPropagation()
    console.log("Plus button pressed")
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
        paddingBottom: expanded ? 8 : 30,
      }}
    >
      <View
        style={{
          borderRadius: 20,
          marginHorizontal: 20,
          backgroundColor: "#111",
          padding: 10,
          paddingHorizontal: 14,
          height: expanded ? Math.min(height + 54, 300) : 40,
          marginBottom: insets.bottom,
        }}
      >
        <Pressable 
          onPress={() => setExpanded(true)}
          style={{ 
            flex: 1,
            flexDirection: "column",
          }}
        >
          <View style={{ flex: 1 }}>
            {expanded && (
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
                placeholder="Message"
                placeholderTextColor="#666"
              />
            )}
          </View>

          <View style={{ 
            flexDirection: "row",
            alignItems: "center",
            minHeight: 24,
          }}>
            <Pressable onPress={handlePlusPress} style={{ marginRight: 8 }}>
              <AntDesign name="plus" size={24} color="#666" />
            </Pressable>
            
            {!expanded && (
              <TextInput
                pointerEvents="none"
                editable={false}
                style={{
                  flex: 1,
                  color: "#666",
                  fontSize: 16,
                  fontFamily: typography.primary.normal,
                }}
                placeholder="Message"
                placeholderTextColor="#666"
              />
            )}

            <Pressable onPress={handleMicPress} style={{ marginLeft: 8 }}>
              <FontAwesome name="microphone" size={24} color="#666" />
            </Pressable>
          </View>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  )
}