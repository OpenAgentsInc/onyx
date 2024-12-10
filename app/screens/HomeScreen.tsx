import { observer } from "mobx-react-lite"
import { FC } from "react"
import { View, ViewStyle } from "react-native"
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
      contentContainerStyle={$screenContainer}
    >
      <View style={$container}>
        <Text text="Nostr Feed" style={$headerText} />
        <View style={$feedContainer}>
          <Feed onEventPress={handleEventPress} />
        </View>
      </View>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: 'black',
}

const $screenContainer: ViewStyle = {
  flex: 1,
  backgroundColor: '#111', // Debug color
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: '#222', // Debug color
}

const $feedContainer: ViewStyle = {
  flex: 1,
  backgroundColor: '#333', // Debug color
}

const $headerText = {
  color: 'white',
  fontSize: 24,
  textAlign: 'center',
  marginVertical: 16,
}