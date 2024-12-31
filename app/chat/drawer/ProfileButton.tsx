import { observer } from "mobx-react-lite"
import React from "react"
import { Text, TouchableOpacity } from "react-native"
import { useStores } from "@/models"
import { navigate } from "@/navigators"
import { colorsDark as colors, typography } from "@/theme"

interface ProfileButtonProps {
  setOpen: (open: boolean) => void
}

export const ProfileButton = observer(({ setOpen }: ProfileButtonProps) => {
  const { walletStore } = useStores()
  const npub = walletStore.nostrKeys?.npub

  return (
    <TouchableOpacity
      style={{
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
      onPress={() => {
        setOpen(false)
        navigate("Profile")
      }}
    >
      <Text style={{ color: colors.text, fontSize: 16, fontFamily: typography.primary.normal }}>
        Profile ({npub ? npub.slice(0, 8) + "..." : "Not connected"})
      </Text>
    </TouchableOpacity>
  )
})
