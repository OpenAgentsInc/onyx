import { useEffect, useRef, useState } from 'react'
import * as Notifications from 'expo-notifications'
import NotificationService from '@/services/notifications'

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState('')
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined)
  const notificationListener = useRef<Notifications.EventSubscription>()
  const responseListener = useRef<Notifications.EventSubscription>()

  useEffect(() => {
    // Initialize notifications and get token
    NotificationService.init()
      .then(() => {
        const token = NotificationService.getExpoPushToken()
        setExpoPushToken(token)
      })
      .catch(error => {
        console.error('Error initializing notifications:', error)
        setExpoPushToken(`${error}`)
      })

    // Set up notification listeners
    notificationListener.current = NotificationService.addNotificationReceivedListener(
      notification => {
        setNotification(notification)
      },
    )

    responseListener.current = NotificationService.addNotificationResponseReceivedListener(
      response => {
        console.log('Notification response:', response)
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
    expoPushToken,
    notification,
    sendTestNotification: NotificationService.sendTestNotification.bind(NotificationService),
  }
}