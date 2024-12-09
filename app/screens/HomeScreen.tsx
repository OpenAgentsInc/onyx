import { observer } from "mobx-react-lite"
import { FC } from "react"
import { View, ViewStyle } from "react-native"
import { Feed, FeedEvent, Screen, Text } from "@/components"
import { MainTabScreenProps } from "@/navigators"

interface HomeScreenProps extends MainTabScreenProps<"Home"> { }

export const HomeScreen: FC<HomeScreenProps> = observer(function HomeScreen({ navigation }) {
  const handleEventPress = (event: FeedEvent) => {
    navigation.navigate("EventReferences", { event })
  }

  return (
    <Screen
      style={$root}
      preset="fixed"
      contentContainerStyle={$screenContainer}
    >
      <View style={$container}>
        <Feed onEventPress={handleEventPress} />
      </View>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}

const $screenContainer: ViewStyle = {
  flex: 1,
}

const $container: ViewStyle = {
  flex: 1,
}

const $headerText = {
  color: '#fafafa', // --foreground: 0 0% 98%
  fontSize: 24,
  textAlign: 'center',
  marginVertical: 16,
  fontWeight: '600',
}
