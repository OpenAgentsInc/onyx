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
    <>
      <TouchableWithoutFeedback onPress={handleOutsidePress}>
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}
      >
        {showTextInput && (
          <View
            style={{
              backgroundColor: "#1B1B1B",
              marginHorizontal: 30,
              height: 40,
              marginBottom: 20,
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
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 20,
            marginBottom: 50,
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
      </KeyboardAvoidingView>
    </>
  )
}