import { Platform } from 'react-native'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'

// Configure how notifications are presented when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export class NotificationService {
  private static instance: NotificationService
  private expoPushToken: string = ''

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  async init() {
    if (!Device.isDevice) {
      console.log('Must use physical device for Push Notifications')
      return
    }

    // Request permission
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!')
      return
    }

    // Set up Android channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      })
    }

    // Get push token
    try {
      const projectId = Constants?.expoConfig?.extra?.eas?.projectId
      if (!projectId) {
        throw new Error('Project ID not found')
      }
      const token = await Notifications.getExpoPushTokenAsync({
        projectId,
      })
      this.expoPushToken = token.data
      console.log('Push token:', token.data)
    } catch (e) {
      console.error('Error getting push token:', e)
    }
  }

  getExpoPushToken(): string {
    return this.expoPushToken
  }

  // Add notification listeners
  addNotificationReceivedListener(
    callback: (notification: Notifications.Notification) => void,
  ) {
    return Notifications.addNotificationReceivedListener(callback)
  }

  addNotificationResponseReceivedListener(
    callback: (response: Notifications.NotificationResponse) => void,
  ) {
    return Notifications.addNotificationResponseReceivedListener(callback)
  }

  // Remove notification listeners
  removeNotificationSubscription(subscription: Notifications.Subscription) {
    Notifications.removeNotificationSubscription(subscription)
  }

  // Send a test notification (for development)
  async sendTestNotification() {
    if (!this.expoPushToken) {
      console.log('No push token available')
      return
    }

    const message = {
      to: this.expoPushToken,
      sound: 'default',
      title: 'Test Notification',
      body: 'This is a test notification',
      data: { someData: 'goes here' },
    }

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })
  }
}

export default NotificationService.getInstance()