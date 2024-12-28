import { useState } from "react"
import { Pressable, View, TextInput } from "react-native"
import { AntDesign, FontAwesome } from "@expo/vector-icons"

export const ChatBar = () => {
  const [expanded, setExpanded] = useState(false)
  
  return (
    <View
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
            height: expanded ? 80 : 40,
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
                  flex: 1,
                  fontSize: 16,
                }}
                placeholder="Type a message..."
                placeholderTextColor="#666"
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: 10,
                  borderTopWidth: 1,
                  borderTopColor: "#222",
                }}
              >
                <AntDesign name="plus" size={24} color="#666" />
                <FontAwesome name="microphone" size={24} color="#666" />
              </View>
            </View>
          ) : null}
        </View>
      </Pressable>
    </View>
  )
}