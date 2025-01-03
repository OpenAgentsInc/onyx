import { useState } from "react"
import { Drawer } from "react-native-drawer-layout"
import { Screen } from "@/components/Screen"
import { $styles } from "@/theme"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"
import { Chat } from "../Chat"
import { ChatDrawerContent } from "./index"

export const ChatDrawerLayout = () => {
  const [open, setOpen] = useState(false)
  const $drawerInsets = useSafeAreaInsetsStyle(["top", "bottom"])

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
        contentContainerStyle={$styles.flex1}
        KeyboardAvoidingViewProps={{ behavior: undefined }}
      >
        <Chat drawerOpen={open} setDrawerOpen={setOpen} />
      </Screen>
    </Drawer>
  )
}