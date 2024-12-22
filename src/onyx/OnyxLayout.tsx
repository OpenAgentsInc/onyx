import { Image, TouchableOpacity, View } from "react-native"

export const OnyxLayout = () => {
  const ICON_SIZE = 56
  return (
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
      <TouchableOpacity activeOpacity={0.8}>
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
  )
}