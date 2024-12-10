import { FC } from "react"
import { FlatList, ListRenderItem, View, ViewStyle } from "react-native"
import { FeedCard, FeedEvent } from "./FeedCard"
import { Text } from "./Text"

// Dummy data based on NIP89 and NIP90
const DUMMY_EVENTS: FeedEvent[] = [
  {
    id: "1",
    kind: 31989,
    pubkey: "abc123",
    content: "",
    tags: [["d", "5001"], ["a", "31990:app1:123", "wss://relay1", "ios"]],
    created_at: Date.now(),
    title: "AI Text Generation",
    description: "Fast and accurate text generation service using state-of-the-art language models"
  },
  {
    id: "2", 
    kind: 31989,
    pubkey: "def456",
    content: "",
    tags: [["d", "5002"], ["a", "31990:app2:456", "wss://relay2", "web"]],
    created_at: Date.now(),
    title: "Image Analysis",
    description: "Computer vision service for object detection and scene understanding"
  },
  {
    id: "3",
    kind: 5001,
    pubkey: "ghi789",
    content: "",
    tags: [
      ["i", "Write a blog post about Bitcoin", "text"],
      ["bid", "1000"]
    ],
    created_at: Date.now(),
    title: "Need Blog Post About Bitcoin",
    description: "Looking for a service to write a comprehensive blog post about Bitcoin's history and impact",
    price: 1000
  },
  {
    id: "4",
    kind: 5002,
    pubkey: "jkl012",
    content: "",
    tags: [
      ["i", "Analyze this image for defects", "text"],
      ["bid", "500"]
    ],
    created_at: Date.now(),
    title: "Quality Control Image Analysis",
    description: "Need automated analysis of manufacturing parts for quality control",
    price: 500
  }
]

interface FeedProps {
  onEventPress?: (event: FeedEvent) => void
}

export const Feed: FC<FeedProps> = ({ onEventPress }) => {
  const renderItem: ListRenderItem<FeedEvent> = ({ item }) => (
    <FeedCard 
      event={item}
      onPress={() => onEventPress?.(item)}
    />
  )

  return (
    <View style={$container}>
      <Text text="DEBUG: Feed Component" style={$debugText} />
      <View style={$debugBox}>
        <Text text={`Events: ${DUMMY_EVENTS.length}`} style={$debugText} />
      </View>
      <FlatList
        data={DUMMY_EVENTS}
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
  backgroundColor: "#222", // Darker gray for debugging
}

const $debugBox: ViewStyle = {
  backgroundColor: "#444",
  padding: 10,
  margin: 10,
}

const $debugText = {
  color: "white",
  fontSize: 16,
}

const $list: ViewStyle = {
  flex: 1,
  backgroundColor: "#333", // Different gray for debugging
}

const $listContent: ViewStyle = {
  paddingHorizontal: 16,
  paddingTop: 8,
  paddingBottom: 24,
}