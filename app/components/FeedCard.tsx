import { FC } from "react"
import { Card } from "./Card"
import { Text } from "./Text"
import { View, ViewStyle } from "react-native"

export interface FeedEvent {
  id: string
  kind: number // 31989 for NIP89 or 5000-5999 for NIP90 requests
  pubkey: string
  content: string
  tags: string[][]
  created_at: number
  title: string
  description: string
  price?: number // For NIP90 requests
}

interface FeedCardProps {
  event: FeedEvent
  onPress?: () => void
}

export const FeedCard: FC<FeedCardProps> = ({ event, onPress }) => {
  const isNIP89 = event.kind === 31989
  const isNIP90 = event.kind >= 5000 && event.kind < 6000

  return (
    <Card
      preset="reversed"
      heading={event.title}
      content={event.description}
      footer={isNIP90 ? `${event.price} sats` : undefined}
      style={$card}
      onPress={onPress}
      RightComponent={
        <View style={$badge}>
          <Text text={isNIP89 ? "Service" : "Request"} style={$badgeText} />
        </View>
      }
      contentContainerStyle={$cardContent}
    />
  )
}

const $card: ViewStyle = {
  marginVertical: 8,
  backgroundColor: "#333",
  borderColor: "#444",
}

const $cardContent: ViewStyle = {
  flex: 1,
  paddingVertical: 12,
}

const $badge: ViewStyle = {
  backgroundColor: "#222",
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 4,
  alignSelf: "flex-start",
  marginRight: 8,
}

const $badgeText = {
  color: "white",
  fontSize: 12,
}