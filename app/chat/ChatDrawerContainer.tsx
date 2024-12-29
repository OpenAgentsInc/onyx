import { useState } from "react"
import {
  Dimensions,
  Keyboard,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native"
import { Drawer } from "react-native-drawer-layout"
import { Screen } from "@/components/Screen"
import { $styles } from "@/theme"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"
import { Feather } from "@expo/vector-icons"
import { Chat } from "./Chat"
import { ChatDrawerContent } from "./ChatDrawerContent"

const isAndroid = Platform.OS === "android"

export const ChatDrawerContainer = () => {
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
      <Screen
        preset="fixed"
        safeAreaEdges={["top"]}
        contentContainerStyle={$styles.flex1}
        {...(isAndroid ? { KeyboardAvoidingViewProps: { behavior: undefined } } : {})}
      >
        <TouchableOpacity onPress={() => setOpen((prevOpen) => !prevOpen)} style={$menuButton}>
          <Feather name="menu" size={24} color="white" />
        </TouchableOpacity>
        <View style={$chatContainer}>
          <Chat />
        </View>
      </Screen>

      {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[$drawerInsets, $container]}>
          <TouchableOpacity onPress={() => setOpen((prevOpen) => !prevOpen)} style={$menuButton}>
            <Feather name="menu" size={24} color="white" />
          </TouchableOpacity>
          <View style={$chatContainer}>
            <Chat />
          </View>
        </View>
      </TouchableWithoutFeedback> */}
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
