import { observer } from "mobx-react-lite"
import { Text, View } from "react-native"
import { useHeader } from "@/hooks/useHeader"
import { useStores } from "@/models"
import { goBack } from "@/navigators"
import { colorsDark as colors, typography } from "@/theme"

export const ProfileScreen = observer(() => {
  const { walletStore } = useStores()

  useHeader({
    title: "Profile",
    leftIcon: "back",
    onLeftPress: goBack,
  })

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingHorizontal: 10 }}>
      <Text
        style={{
          color: colors.text,
          fontSize: 16,
          marginTop: 20,
          fontFamily: typography.primary.light,
        }}
      >
        Your NPUB: {walletStore.nostrKeys?.npub || "Not connected"}
      </Text>
    </View>
  )
})
