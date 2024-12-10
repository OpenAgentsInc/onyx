import { observer } from "mobx-react-lite"
import { FC } from "react"
import { ViewStyle } from "react-native"
import { Screen, Text, Feed, FeedEvent } from "@/components"
import { MainTabScreenProps } from "@/navigators"

interface HomeScreenProps extends MainTabScreenProps<"Home"> { }

export const HomeScreen: FC<HomeScreenProps> = observer(function HomeScreen() {
  const handleEventPress = (event: FeedEvent) => {
    // TODO: Handle event press - navigate to detail screen or show modal
    console.log("Event pressed:", event)
  }

  return (
    <Screen
      style={$root}
      preset="fixed"
      safeAreaEdges={["top"]}
    >
      <Text text="Nostr Feed" style={$headerText} />
      <Feed onEventPress={handleEventPress} />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: 'black',
}

const $headerText = {
  color: 'white',
  fontSize: 24,
  textAlign: 'center',
  marginVertical: 16,
}