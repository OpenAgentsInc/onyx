import { View } from "react-native"
import { Header } from "@/components"
import { goBack } from "@/navigators"
import { colorsDark as colors } from "@/theme"

export const SettingsScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Settings" leftIcon="back" onLeftPress={() => goBack()} />
    </View>
  )
}
