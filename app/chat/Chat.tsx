import { useState } from "react"
import { Dimensions, Text, TouchableOpacity, View } from "react-native"
import { Drawer } from "react-native-drawer-layout"
import { colors, typography } from "@/theme"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"
import { Feather } from "@expo/vector-icons"

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
          <View
            style={{
              flex: 1,
              backgroundColor: "black",
              ...$drawerInsets,
              borderRightWidth: 1,
              borderRightColor: colors.border,
            }}
          >
            <Text style={{ fontFamily: typography.primary.medium, color: "white" }}>
              Drawer content
            </Text>
          </View>
        )
      }}
    >
      <View style={[$drawerInsets, { padding: 20 }]}>
        <TouchableOpacity onPress={() => setOpen((prevOpen) => !prevOpen)}>
          <Feather name="menu" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </Drawer>
  )
}
