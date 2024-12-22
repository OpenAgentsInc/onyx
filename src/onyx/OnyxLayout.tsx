import { Image, TouchableOpacity } from "react-native"

export const OnyxLayout = () => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{ position: "absolute", bottom: 50, right: 30, zIndex: 8 }}
    >
      <Image source={require("../../assets/images/voice.png")} style={{ width: 50, height: 50 }} />
    </TouchableOpacity>
  )
}
