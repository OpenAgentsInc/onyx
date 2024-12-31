import { View, Text, TouchableOpacity } from "react-native"
import { useHeader } from "@/hooks/useHeader"
import { goBack, navigate } from "@/navigators"
import { styles } from "./styles"
import { Ionicons } from "@expo/vector-icons"
import { colorsDark as colors } from "@/theme"

export const SettingsScreen = () => {
  useHeader({
    title: "Settings",
    leftIcon: "back",
    onLeftPress: goBack,
  })

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.menuItem, { flexDirection: "row", alignItems: "center" }]}
        onPress={() => navigate("Settings", { screen: "ShareScreen" })}
      >
        <Ionicons name="share-outline" size={24} color={colors.palette.neutral800} style={{ marginRight: 12 }} />
        <Text style={styles.menuItemText}>Share this conversation</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.menuItem, { flexDirection: "row", alignItems: "center" }]}
        onPress={() => navigate("Settings", { screen: "AutocoderSettings" })}
      >
        <Ionicons name="settings-outline" size={24} color={colors.palette.neutral800} style={{ marginRight: 12 }} />
        <Text style={styles.menuItemText}>Autocoder Settings</Text>
      </TouchableOpacity>
      
      {/* Add more menu items here */}
    </View>
  )
}