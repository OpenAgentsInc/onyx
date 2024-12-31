import { View, Text, TouchableOpacity } from "react-native"
import { useHeader } from "@/hooks/useHeader"
import { goBack, navigate } from "@/navigators"
import { styles } from "./styles"

export const SettingsScreen = () => {
  useHeader({
    title: "Settings",
    leftIcon: "back",
    onLeftPress: goBack,
  })

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigate("Settings", { screen: "ShareScreen" })}
      >
        <Text style={styles.menuItemText}>Share this conversation</Text>
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