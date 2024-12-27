import { useState } from "react"
import { Dimensions, TouchableOpacity, View } from "react-native"
import { Drawer } from "react-native-drawer-layout"
import { OnyxLayout } from "@/onyx/OnyxLayout"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"
import { Feather } from "@expo/vector-icons"
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
      renderDrawerContent={() => (
        <ChatDrawerContent drawerInsets={$drawerInsets} setOpen={setOpen} />
      )}
    >
      <View style={$drawerInsets}>
        <TouchableOpacity
          onPress={() => setOpen((prevOpen) => !prevOpen)}
          style={{
            position: "absolute",
            top: 55,
            left: 15,
            zIndex: 900,
            backgroundColor: "rgba(32, 32, 32, 0.8)",
            padding: 8,
            borderRadius: 4,
          }}
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
