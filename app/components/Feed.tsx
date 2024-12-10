import { FC, useContext, useEffect, useRef, useState } from "react"
import { FlatList, ListRenderItem, View, ViewStyle } from "react-native"
import { FeedCard, FeedEvent } from "./FeedCard"
import { RelayContext } from "./RelayProvider"
import { DVMManager } from "@/services/nostr/dvm"

interface FeedProps {
  onEventPress?: (event: FeedEvent) => void
}

export const Feed: FC<FeedProps> = ({ onEventPress }) => {
  const { pool, isConnected } = useContext(RelayContext)
  const [events, setEvents] = useState<FeedEvent[]>([])
  const [dvmManager] = useState(() => new DVMManager(pool))
  const isSubscribed = useRef(false)

  // Wait for relay connection before subscribing
  useEffect(() => {
    if (!pool || !isConnected || isSubscribed.current) {
      console.log("Feed subscription conditions not met:", { 
        hasPool: !!pool, 
        isConnected, 
        isSubscribed: isSubscribed.current 
      })
      return
    }

    console.log("Feed conditions met, starting subscriptions...")
    isSubscribed.current = true

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
      isSubscribed.current = false
    }
  }, [pool, isConnected, dvmManager])

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