import { useState } from "react"
import { Image, TextInput, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from "react-native"
import { typography } from "@/theme"

export const OnyxLayout = () => {
  const ICON_SIZE = 56
  const [showTextInput, setShowTextInput] = useState(false)

  const handleTextPress = () => {
    if (showTextInput) {
      Keyboard.dismiss()
      setShowTextInput(false)
    } else {
      setShowTextInput(true)
    }
  }

  const handleOutsidePress = () => {
    Keyboard.dismiss()
    setShowTextInput(false)
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={handleOutsidePress}>
        <View style={{ flex: 1 }}>
          {showTextInput && (
            <View
              style={{
                position: "absolute",
                backgroundColor: "#1B1B1B",
                left: 30,
                right: 30,
                height: 40,
                bottom: 120,
                zIndex: 8,
                borderRadius: 10,
                paddingHorizontal: 15,
                justifyContent: "center",
              }}
            >
              <TextInput
                style={{
                  color: "#fff",
                  fontSize: 16,
                  height: "100%",
                  fontFamily: typography.primary.normal,
                }}
                placeholder="Type a message..."
                placeholderTextColor="#666"
                autoFocus
                onBlur={() => setShowTextInput(false)}
              />
            </View>
          )}

          <View
            style={{
              position: "absolute",
              bottom: 50,
              left: 0,
              right: 0,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 20,
              zIndex: 8,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleTextPress}
            >
              <Image
                source={require("../../assets/icons/text.png")}
                style={{ width: ICON_SIZE, height: ICON_SIZE }}
              />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8}>
              <Image
                source={require("../../assets/icons/voice.png")}
                style={{ width: ICON_SIZE, height: ICON_SIZE }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}