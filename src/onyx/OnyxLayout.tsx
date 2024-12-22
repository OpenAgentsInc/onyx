import { Image, TouchableOpacity } from "react-native"

export const OnyxLayout = () => {
  const ICON_SIZE = 56
  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        style={{ position: "absolute", bottom: 50, left: 40, zIndex: 8 }}
      >
        <Image
          source={require("../../assets/icons/text.png")}
          style={{ width: ICON_SIZE, height: ICON_SIZE }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        style={{ position: "absolute", bottom: 50, right: 40, zIndex: 8 }}
      >
        <Image
          source={require("../../assets/icons/voice.png")}
          style={{ width: ICON_SIZE, height: ICON_SIZE }}
        />
      </TouchableOpacity>
    </>
  )
}
