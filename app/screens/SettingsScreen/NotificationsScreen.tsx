import * as Notifications from "expo-notifications"
import React, { useEffect, useState } from "react"
import { StyleSheet, Switch, Text, View } from "react-native"
import { useHeader } from "@/hooks/useHeader"
import { goBack } from "@/navigators"
import NotificationService from "@/services/notifications"
import { colorsDark as colors, typography } from "@/theme"
import { useStores } from "@/models/_helpers/useStores"
import { KeyRow } from "@/screens/ProfileScreen/KeyRow"

export const NotificationsScreen = () => {
  const [isEnabled, setIsEnabled] = useState(false)
  const { userStore } = useStores()

  useHeader({
    title: "Notifications",
    leftIcon: "back",
    onLeftPress: goBack,
  })

  useEffect(() => {
    checkPermissions()
    const token = NotificationService.getExpoPushToken()
    if (token) {
      userStore.setPushToken(token)
    }
  }, [])

  const checkPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync()
    setIsEnabled(status === "granted")
  }

  const toggleSwitch = async () => {
    if (!isEnabled) {
      const { status } = await Notifications.requestPermissionsAsync()
      if (status === "granted") {
        await NotificationService.init()
        const token = NotificationService.getExpoPushToken()
        if (token) {
          userStore.setPushToken(token)
        }
      }
      setIsEnabled(status === "granted")
    } else {
      userStore.clearPushToken()
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Push Notifications</Text>
        <Switch
          trackColor={{ false: colors.palette.neutral400, true: colors.palette.primary300 }}
          thumbColor={isEnabled ? colors.palette.primary500 : colors.palette.neutral200}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>

      {userStore.pushToken ? (
        <View style={styles.section}>
          <KeyRow 
            label="Push Token" 
            value={userStore.pushToken}
          />
          <Text style={styles.hint}>
            Long press the token to copy it to clipboard
          </Text>
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  section: {
    backgroundColor: colors.palette.neutral100,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: typography.primary.normal,
    color: colors.text,
    marginBottom: 8,
  },
  hint: {
    color: colors.textDim,
    fontSize: 12,
    marginTop: 8,
    fontFamily: typography.primary.normal,
  },
})