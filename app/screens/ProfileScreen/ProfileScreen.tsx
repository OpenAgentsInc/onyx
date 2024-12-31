import { observer } from "mobx-react-lite"
import { Text, View } from "react-native"
import { useHeader } from "@/hooks/useHeader"
import { useStores } from "@/models"
import { goBack } from "@/navigators"
import { colorsDark as colors, typography } from "@/theme"
import { KeyRow } from "./KeyRow"

export const ProfileScreen = observer(() => {
  const { walletStore } = useStores()
  const nostrKeys = walletStore.nostrKeys

  useHeader({
    title: "Profile",
    leftIcon: "back",
    onLeftPress: goBack,
  })

  if (!nostrKeys) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, paddingHorizontal: 16 }}>
        <Text 
          style={{ 
            color: colors.text, 
            fontSize: 16, 
            marginTop: 20,
            fontFamily: typography.primary.normal,
          }}
        >
          Not connected
        </Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingHorizontal: 16 }}>
      <Text
        style={{
          color: colors.text,
          fontSize: 20,
          marginTop: 20,
          marginBottom: 16,
          fontFamily: typography.primary.medium,
        }}
      >
        Your Nostr Keys
      </Text>
      
      <KeyRow label="Public Key (hex)" value={nostrKeys.publicKey} />
      <KeyRow label="Public Key (npub)" value={nostrKeys.npub} />
      <KeyRow label="Private Key (hex)" value={nostrKeys.privateKey} isSecret />
      <KeyRow label="Private Key (nsec)" value={nostrKeys.nsec} isSecret />
      
      <Text
        style={{
          color: colors.textDim,
          fontSize: 12,
          marginTop: 16,
          fontFamily: typography.primary.normal,
        }}
      >
        Long press any key to copy it to clipboard
      </Text>
    </View>
  )
})