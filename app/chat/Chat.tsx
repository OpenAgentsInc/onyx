import { useState } from "react"
import { Dimensions, TouchableOpacity, View } from "react-native"
import { Drawer } from "react-native-drawer-layout"
import { OnyxLayout } from "@/onyx/OnyxLayout"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons"
import { ChatDrawerContent } from "./ChatDrawerContent"

export const Chat = () => {
  const [open, setOpen] = useState(false)
  const $drawerInsets = useSafeAreaInsetsStyle(["top"])

  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      drawerType="slide"
      renderDrawerContent={<ChatDrawerContent drawerInsets={$drawerInsets} />}
    >
      <View style={$drawerInsets}>
        <TouchableOpacity
          onPress={() => setOpen((prevOpen) => !prevOpen)}
          style={{ position: "absolute", top: 80, left: 20, zIndex: 900 }}
        >
          <Feather name="menu" size={24} color="white" />
        </TouchableOpacity>
        <View
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            height: Dimensions.get("window").height,
          }}
        >
          <OnyxLayout />
        </View>
      </View>
    </Drawer>
  )
}
