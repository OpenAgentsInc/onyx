import { FC } from "react"
import { Card } from "./Card"
import { Text } from "./Text"
import { View, ViewStyle } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { AppStackScreenProps } from "../navigators/AppNavigator"

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
  const navigation = useNavigation<any>()

  const handlePress = () => {
    if (onPress) {
      onPress()
    } else {
      navigation.navigate("EventReferences", { event })
    }
  }

  return (
    <Card
      preset="reversed"
      heading={event.title}
      content={event.description}
      footer={isNIP90 ? `${event.price} sats` : undefined}
      style={$card}
      onPress={handlePress}
      RightComponent={
        <View style={$badge}>
          <Text text={isNIP89 ? "Service" : "Request"} style={$badgeText} />
        </View>
      }
      contentContainerStyle={$cardContent}
      headingStyle={$heading}
      contentStyle={$description}
      footerStyle={$footer}
    />
  )
}

const $card: ViewStyle = {
  marginVertical: 8,
  backgroundColor: "#0a0a0c", // --card: 240 10% 3.9%
  borderColor: "#292930", // --border: 240 3.7% 15.9%
  borderWidth: 1,
  borderRadius: 12,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
}

const $cardContent: ViewStyle = {
  flex: 1,
  padding: 24,
}

const $badge: ViewStyle = {
  backgroundColor: "#292930", // --secondary: 240 3.7% 15.9%
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 4,
  alignSelf: "flex-start",
  marginRight: 8,
}

const $heading = {
  color: "#fafafa", // --card-foreground: 0 0% 98%
  fontSize: 16,
  fontWeight: "600",
  marginBottom: 8,
}

const $description = {
  color: "#a5a5af", // --muted-foreground: 240 5% 64.9%
  fontSize: 14,
  lineHeight: 20,
}

const $footer = {
  color: "#fafafa", // --card-foreground: 0 0% 98%
  fontSize: 12,
}

const $badgeText = {
  color: "#fafafa", // --secondary-foreground: 0 0% 98%
  fontSize: 12,
}