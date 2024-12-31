import { observer } from "mobx-react-lite"
import { useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { useHeader } from "@/hooks/useHeader"
import { useStores } from "@/models"
import { goBack } from "@/navigators"
import { colorsDark as colors, typography } from "@/theme"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import Clipboard from "@react-native-clipboard/clipboard"

const KeyRow = ({ label, value, isSecret = false }) => {
  const [showSecret, setShowSecret] = useState(false)

  const copyToClipboard = () => {
    Clipboard.setString(value)
  }

  const displayValue = isSecret && !showSecret ? "••••••••••••••••••••" : value

  return (
    <View style={{ marginVertical: 8 }}>
      <Text
        style={{
          color: colors.textDim,
          fontSize: 14,
          marginBottom: 4,
          fontFamily: typography.primary.normal,
        }}
      >
        {label}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          onLongPress={copyToClipboard}
          activeOpacity={0.7}
          style={{
            flex: 1,
            backgroundColor: colors.backgroundSecondary,
            padding: 12,
            borderRadius: 8,
            marginRight: isSecret ? 8 : 0,
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: 14,
              fontFamily: typography.primary.normal,
            }}
            numberOfLines={1}
          >
            {displayValue}
          </Text>
        </TouchableOpacity>
        {isSecret && (
          <TouchableOpacity
            onPress={() => setShowSecret(!showSecret)}
            activeOpacity={0.7}
            style={{
              padding: 8,
            }}
          >
            <MaterialCommunityIcons
              name={showSecret ? "eye-off" : "eye"}
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

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

      <KeyRow label="Public Key (npub)" value={nostrKeys.npub} />
      <KeyRow label="Public Key (hex)" value={nostrKeys.publicKey} />
      <KeyRow label="Private Key (nsec)" value={nostrKeys.nsec} isSecret />
      <KeyRow label="Private Key (hex)" value={nostrKeys.privateKey} isSecret />

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
