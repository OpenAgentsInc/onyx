import { useState } from "react"
import { Dimensions, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard } from "react-native"
import { Drawer } from "react-native-drawer-layout"
import { OnyxLayout } from "@/onyx/OnyxLayout"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"
import { Feather } from "@expo/vector-icons"
import { ChatBar } from "./ChatBar"
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[$drawerInsets, $container]}>
          <TouchableOpacity
            onPress={() => setOpen((prevOpen) => !prevOpen)}
            style={$menuButton}
          >
            <Feather name="menu" size={24} color="white" />
          </TouchableOpacity>
          <View style={$chatContainer}>
            <ChatBar />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Drawer>
  )
}

const $container = {
  flex: 1,
}

const $menuButton = {
  position: "absolute",
  top: 55,
  left: 15,
  zIndex: 900,
  backgroundColor: "rgba(32, 32, 32, 0.8)",
  padding: 8,
  borderRadius: 4,
} as const

const $chatContainer = {
  position: "absolute",
  top: 0,
  right: 0,
  left: 0,
  bottom: 0,
  height: Dimensions.get("window").height,
} as const