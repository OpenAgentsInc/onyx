import { observer } from "mobx-react-lite"
import React from "react"
import { Text, TouchableOpacity } from "react-native"
import { useStores } from "@/models"
import { navigate } from "@/navigators"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { styles } from "./styles"

interface ProfileButtonProps {
  setOpen: (open: boolean) => void
}

export const ProfileButton = observer(({ setOpen }: ProfileButtonProps) => {
  const { walletStore } = useStores()
  const npub = walletStore.nostrKeys?.npub

  const handleProfilePress = () => {
    setOpen(false)
    navigate("Profile")
  }

  return (
    <TouchableOpacity
      onPress={handleProfilePress}
      style={[styles.walletButton, { marginBottom: 16, marginTop: 6 }]}
    >
      <MaterialCommunityIcons name="account-outline" size={24} color="white" />
      <Text style={styles.buttonText}>
        Profile ({npub ? npub.slice(0, 8) + "..." : "Not connected"})
      </Text>
    </TouchableOpacity>
  )
})
