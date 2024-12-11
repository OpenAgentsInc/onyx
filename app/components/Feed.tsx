import { FC, useContext, useEffect, useRef, useState } from "react"
import {
  ActivityIndicator, FlatList, ListRenderItem, View, ViewStyle
} from "react-native"
import { RelayContext } from "@/providers/RelayProvider"
import { DVMManager } from "@/services/nostr/dvm"
import { FeedCard, FeedEvent } from "./FeedCard"
import { Text } from "./Text"

interface FeedProps {
  onEventPress?: (event: FeedEvent) => void
}

export const Feed: FC<FeedProps> = ({ onEventPress }) => {
  const { pool, isConnected } = useContext(RelayContext)
  const [events, setEvents] = useState<FeedEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const isSubscribed = useRef(false)
  const dvmManagerRef = useRef<DVMManager | null>(null)

  // Initialize DVMManager when pool changes
  useEffect(() => {
    if (pool) {
      // console.log("Initializing DVMManager with pool")
      dvmManagerRef.current = new DVMManager(pool)
    } else {
      // console.log("No pool available for DVMManager")
      dvmManagerRef.current = null
    }
  }, [pool])

  // Wait for relay connection before subscribing
  useEffect(() => {
    if (!pool || !isConnected || isSubscribed.current || !dvmManagerRef.current) {
      // console.log("Feed subscription conditions not met:", {
      //   hasPool: !!pool,
      //   isConnected,
      //   isSubscribed: isSubscribed.current,
      //   hasDVMManager: !!dvmManagerRef.current
      // })
      return
    }

    // console.log("Feed conditions met, starting subscriptions...")
    isSubscribed.current = true

    // Subscribe to both services and jobs
    const subs = []

    // Subscribe to jobs
    // console.log("Subscribing to jobs...")
    const jobsSub = dvmManagerRef.current.subscribeToJobs((event) => {
      // console.log("Job callback received event:", event)
      try {
        const parsedEvent = dvmManagerRef.current.parseJobRequest(event)
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

    // Set loading to false after subscriptions are set up
    setIsLoading(false)

    return () => {
      console.log("Cleaning up subscriptions...")
      subs.forEach(sub => sub?.unsub?.())
      isSubscribed.current = false
    }
  }, [pool, isConnected])

  const renderItem: ListRenderItem<FeedEvent> = ({ item }) => (
    <FeedCard
      event={item}
      onPress={() => onEventPress?.(item)}
    />
  )

  if (isLoading) {
    return (
      <View style={$loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text
          text="Loading feed..."
          style={$loadingText}
        />
      </View>
    )
  }

  return (
    <View style={$container}>
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={$listContent}
        showsVerticalScrollIndicator={false}
        style={$list}
        ListEmptyComponent={
          <View style={$emptyContainer}>
            <Text
              text="No events found"
              style={$emptyText}
            />
          </View>
        }
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

const $loadingContainer: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#000000',
}

const $loadingText = {
  color: '#ffffff',
  marginTop: 16,
  fontSize: 16,
}

const $emptyContainer: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: 32,
}

const $emptyText = {
  color: '#ffffff',
  fontSize: 16,
}
