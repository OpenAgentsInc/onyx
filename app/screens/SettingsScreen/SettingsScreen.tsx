import { View, Text, TouchableOpacity, Share } from "react-native"
import { useHeader } from "@/hooks/useHeader"
import { goBack, navigate } from "@/navigators"
import { colorsDark as colors } from "@/theme"
import { styles } from "@/theme/onyx"

export const SettingsScreen = () => {
  useHeader({
    title: "Settings",
    leftIcon: "back",
    onLeftPress: goBack,
  })

  const handleShareConversation = async () => {
    try {
      await Share.share({
        message: "Check out my conversation on Onyx!",
        // TODO: Implement actual conversation sharing logic
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingHorizontal: 16 }}>
      <TouchableOpacity
        style={[styles.button, { marginTop: 16 }]}
        onPress={handleShareConversation}
      >
        <Text style={styles.buttonText}>Share this conversation</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 24 }}>
        <TouchableOpacity
          style={[styles.menuItem, { padding: 16, borderRadius: 8, backgroundColor: colors.card }]}
          onPress={() => navigate("Settings", { screen: "AutocoderSettings" })}
        >
          <Text style={[styles.text, { fontSize: 16 }]}>Autocoder Settings</Text>
        </TouchableOpacity>
        
        {/* Add more menu items here */}
      </View>
    </View>
  )
}