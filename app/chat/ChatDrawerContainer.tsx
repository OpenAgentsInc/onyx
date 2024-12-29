import { useState } from "react"
import { Platform } from "react-native"
import { Drawer } from "react-native-drawer-layout"
import { Screen } from "@/components/Screen"
import { $styles } from "@/theme"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"
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
        safeAreaEdges={["bottom"]}
        contentContainerStyle={$styles.flex1}
        {...(isAndroid ? { KeyboardAvoidingViewProps: { behavior: undefined } } : {})}
      >
        <Chat drawerOpen={open} setDrawerOpen={setOpen} />
      </Screen>
    </Drawer>
  )
}
