import { useEffect, useRef } from 'react'
import * as Notifications from 'expo-notifications'
import NotificationService from '@/services/notifications'

export function useNotifications() {
  const notificationListener = useRef<Notifications.Subscription>()
  const responseListener = useRef<Notifications.Subscription>()

  useEffect(() => {
    // Set up notification listeners
    notificationListener.current = NotificationService.addNotificationReceivedListener(
      notification => {
        console.log('Notification received:', notification)
        // Handle the notification here
        // You can dispatch actions, update state, etc.
      },
    )

    responseListener.current = NotificationService.addNotificationResponseReceivedListener(
      response => {
        console.log('Notification response:', response)
        // Handle user's response to the notification
        // This is called when user taps on the notification
      },
    )

    // Cleanup function
    return () => {
      if (notificationListener.current) {
        NotificationService.removeNotificationSubscription(notificationListener.current)
      }
      if (responseListener.current) {
        NotificationService.removeNotificationSubscription(responseListener.current)
      }
    }
  }, [])

  return {
    getExpoPushToken: NotificationService.getExpoPushToken.bind(NotificationService),
    sendTestNotification: NotificationService.sendTestNotification.bind(NotificationService),
  }
}