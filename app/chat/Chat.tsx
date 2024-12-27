import { useState } from "react"
import { Dimensions, Text, TouchableOpacity, View } from "react-native"
import { Drawer } from "react-native-drawer-layout"
import { OnyxLayout } from "@/onyx/OnyxLayout"
import { colors, typography } from "@/theme"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons"

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
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons name="chat-plus-outline" size={24} color="white" />
              <Text
                style={{ fontFamily: typography.primary.medium, color: "white", marginLeft: 12 }}
              >
                New chat
              </Text>
            </View>
          </View>
        )
      }}
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
