import { View, Text } from "react-native"
import { useHeader } from "@/hooks/useHeader"
import { goBack } from "@/navigators"
import { colorsDark as colors } from "@/theme"

export const ShareScreen = () => {
  useHeader({
    title: "Share Conversation",
    leftIcon: "back",
    onLeftPress: goBack,
  })

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingHorizontal: 16 }}>
      <Text>Share screen coming soon...</Text>
    </View>
  )
}