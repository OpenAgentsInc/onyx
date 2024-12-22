import { useState } from "react"
import { Image, TextInput, TouchableOpacity, View, Keyboard, Modal, Pressable, Text } from "react-native"
import { typography } from "@/theme"

export const OnyxLayout = () => {
  const ICON_SIZE = 56
  const [showTextInput, setShowTextInput] = useState(false)
  const [inputText, setInputText] = useState("")

  const handleTextPress = () => {
    setShowTextInput(true)
  }

  const handleCancel = () => {
    Keyboard.dismiss()
    setInputText("")
    setShowTextInput(false)
  }

  const handleSend = () => {
    if (inputText.trim()) {
      // TODO: Handle send
      console.log("Sending:", inputText)
    }
    handleCancel()
  }

  return (
    <>
      <Modal
        visible={showTextInput}
        animationType="fade"
        transparent
        onRequestClose={handleCancel}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.85)",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 20,
              paddingTop: 60,
              paddingBottom: 20,
              gap: 15,
            }}
          >
            <Pressable onPress={handleCancel}>
              <Text
                style={{
                  color: "#666",
                  fontSize: 17,
                  fontFamily: typography.primary.normal,
                }}
              >
                Cancel
              </Text>
            </Pressable>
            
            <TextInput
              style={{
                flex: 1,
                color: "#fff",
                fontSize: 17,
                height: 40,
                backgroundColor: "#1B1B1B",
                borderRadius: 10,
                paddingHorizontal: 15,
                fontFamily: typography.primary.normal,
              }}
              placeholder="Type a message..."
              placeholderTextColor="#666"
              autoFocus
              value={inputText}
              onChangeText={setInputText}
            />

            <Pressable onPress={handleSend}>
              <Text
                style={{
                  color: inputText.trim() ? "#fff" : "#666",
                  fontSize: 17,
                  fontFamily: typography.primary.normal,
                }}
              >
                Send
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

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
    </>
  )
}