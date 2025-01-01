import * as Notifications from "expo-notifications"
import React, { useEffect, useState } from "react"
import { StyleSheet, Switch, Text, View } from "react-native"
import { useHeader } from "@/hooks/useHeader"
import { goBack } from "@/navigators"
import NotificationService from "@/services/notifications"
import { colorsDark as colors, typography } from "@/theme"

export const NotificationsScreen = () => {
  const [isEnabled, setIsEnabled] = useState(false)
  const [pushToken, setPushToken] = useState("")

  useHeader({
    title: "Notifications",
    leftIcon: "back",
    onLeftPress: goBack,
  })

  useEffect(() => {
    checkPermissions()
    setPushToken(NotificationService.getExpoPushToken())
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
        setPushToken(NotificationService.getExpoPushToken())
      }
      setIsEnabled(status === "granted")
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

      {pushToken ? (
        <View style={styles.section}>
          <Text style={styles.label}>Push Token:</Text>
          <Text style={styles.tokenText}>{pushToken}</Text>
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
  tokenText: {
    fontSize: 14,
    color: colors.textDim,
    marginTop: 8,
  },
})
