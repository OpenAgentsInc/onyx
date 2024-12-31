import { View, Text, TouchableOpacity, Share } from "react-native"
import { useHeader } from "@/hooks/useHeader"
import { goBack, navigate } from "@/navigators"
import { styles } from "./styles"

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
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={handleShareConversation}
      >
        <Text style={styles.buttonText}>Share this conversation</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigate("Settings", { screen: "AutocoderSettings" })}
      >
        <Text style={styles.menuItemText}>Autocoder Settings</Text>
      </TouchableOpacity>
      
      {/* Add more menu items here */}
    </View>
  )
}