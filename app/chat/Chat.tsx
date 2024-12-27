import { useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { Drawer } from "react-native-drawer-layout"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"

export const Chat = () => {
  const [open, setOpen] = useState(false)
  const $drawerInsets = useSafeAreaInsetsStyle(["top"])

  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      drawerType="slide"
      renderDrawerContent={() => {
        return (
          <View style={{ flex: 1, backgroundColor: "#222", ...$drawerInsets }}>
            <Text>Drawer content</Text>
          </View>
        )
      }}
    >
      <View style={$drawerInsets}>
        <TouchableOpacity onPress={() => setOpen((prevOpen) => !prevOpen)}>
          <Text style={{ color: "white", margin: 40 }}>Toggle drawer</Text>
        </TouchableOpacity>
      </View>
    </Drawer>
  )
}
