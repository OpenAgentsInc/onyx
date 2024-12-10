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

  useEffect(() => {
    const servicesSub = dvmManager.subscribeToServices()
    const jobsSub = dvmManager.subscribeToJobs()

    // Handle new service announcements
    servicesSub.then(sub => {
      sub.on("event", (event) => {
        const parsedEvent = dvmManager.parseServiceAnnouncement(event)
        setEvents(prev => {
          // Deduplicate by id
          const exists = prev.some(e => e.id === parsedEvent.id)
          if (exists) return prev
          return [parsedEvent, ...prev]
        })
      })
    })

    // Handle new job requests
    jobsSub.then(sub => {
      sub.on("event", (event) => {
        const parsedEvent = dvmManager.parseJobRequest(event)
        setEvents(prev => {
          // Deduplicate by id
          const exists = prev.some(e => e.id === parsedEvent.id)
          if (exists) return prev
          return [parsedEvent, ...prev]
        })
      })
    })

    return () => {
      servicesSub.then(sub => sub.unsub())
      jobsSub.then(sub => sub.unsub())
    }
  }, [dvmManager])

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