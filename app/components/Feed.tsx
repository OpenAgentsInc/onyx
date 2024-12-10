import { FC, useContext, useEffect, useState } from "react"
import { FlatList, ListRenderItem, View, ViewStyle } from "react-native"
import { FeedCard, FeedEvent } from "./FeedCard"
import { RelayContext } from "./RelayProvider"
import { DVMManager } from "@/services/nostr/dvm"

interface FeedProps {
  onEventPress?: (event: FeedEvent) => void
}

export const Feed: FC<FeedProps> = ({ onEventPress }) => {
  const { pool } = useContext(RelayContext)
  const [events, setEvents] = useState<FeedEvent[]>([])
  const [dvmManager] = useState(() => new DVMManager(pool))
  const [isSubscribed, setIsSubscribed] = useState(false)

  // Wait for relay connection before subscribing
  useEffect(() => {
    if (!pool || isSubscribed) return

    // Check if we're connected to any relays
    const relays = pool.relays
    console.log("Current relays:", relays)
    
    if (!relays || relays.length === 0) {
      console.log("No relays connected yet, waiting...")
      return
    }

    console.log("Relays connected, starting subscriptions...")
    setIsSubscribed(true)

    // Subscribe to both services and jobs
    const subs = []

    // Subscribe to services
    console.log("Subscribing to services...")
    const servicesSub = dvmManager.subscribeToServices((event) => {
      console.log("Service callback received event:", event)
      try {
        const parsedEvent = dvmManager.parseServiceAnnouncement(event)
        setEvents(prev => {
          // Deduplicate by id
          const exists = prev.some(e => e.id === parsedEvent.id)
          if (exists) return prev
          return [parsedEvent, ...prev]
        })
      } catch (e) {
        console.error("Error parsing service event:", e)
      }
    })
    subs.push(servicesSub)

    // Subscribe to jobs
    console.log("Subscribing to jobs...")
    const jobsSub = dvmManager.subscribeToJobs((event) => {
      console.log("Job callback received event:", event)
      try {
        const parsedEvent = dvmManager.parseJobRequest(event)
        setEvents(prev => {
          // Deduplicate by id
          const exists = prev.some(e => e.id === parsedEvent.id)
          if (exists) return prev
          return [parsedEvent, ...prev]
        })
      } catch (e) {
        console.error("Error parsing job event:", e)
      }
    })
    subs.push(jobsSub)

    // Log subscription status
    console.log(`Subscribed to ${subs.length} event types`)

    return () => {
      console.log("Cleaning up subscriptions...")
      subs.forEach(sub => sub?.unsub?.())
      setIsSubscribed(false)
    }
  }, [pool, dvmManager, isSubscribed])

  const renderItem: ListRenderItem<FeedEvent> = ({ item }) => (
    <FeedCard 
      event={item}
      onPress={() => onEventPress?.(item)}
    />
  )

  return (
    <View style={$container}>
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={$listContent}
        showsVerticalScrollIndicator={false}
        style={$list}
      />
    </View>
  )
}

const $container: ViewStyle = {
  flex: 1,
  width: "100%",
}

const $list: ViewStyle = {
  flex: 1,
}

const $listContent: ViewStyle = {
  paddingHorizontal: 16,
  paddingTop: 8,
  paddingBottom: 24,
}