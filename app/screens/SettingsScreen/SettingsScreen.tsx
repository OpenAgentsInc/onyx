import { View } from "react-native"
import { useHeader } from "@/hooks/useHeader"
import { goBack } from "@/navigators"
import { colorsDark as colors } from "@/theme"
import { RepoSettings } from "./coder/RepoSettings"

export const SettingsScreen = () => {
  useHeader({
    title: "Settings",
    leftIcon: "back",
    onLeftPress: goBack,
  })
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingHorizontal: 10 }}>
      <RepoSettings />
    </View>
  )
}
