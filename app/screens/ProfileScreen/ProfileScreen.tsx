import { View, Text } from "react-native"
import { useHeader } from "@/hooks/useHeader"
import { goBack } from "@/navigators"
import { colorsDark as colors } from "@/theme"
import { useStores } from "@/models"
import { observer } from "mobx-react-lite"

export const ProfileScreen = observer(() => {
  const { walletStore } = useStores()
  const npub = walletStore.npub

  useHeader({
    title: "Profile",
    leftIcon: "back",
    onLeftPress: goBack,
  })

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingHorizontal: 10 }}>
      <Text style={{ color: colors.text, fontSize: 16, marginTop: 20 }}>
        Your NPUB: {npub || "Not connected"}
      </Text>
    </View>
  )
})