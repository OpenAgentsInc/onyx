import { Pressable, View } from "react-native"

export const ChatBar = () => {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
      }}
    >
      <Pressable>
        <View
          style={{
            height: 40,
            borderRadius: 20,
            marginBottom: 30,
            marginLeft: 20,
            marginRight: 20,
            backgroundColor: "#111",
          }}
        ></View>
      </Pressable>
    </View>
  )
}
