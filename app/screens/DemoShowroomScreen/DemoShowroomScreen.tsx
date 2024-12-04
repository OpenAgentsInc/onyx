import { observer } from "mobx-react-lite"
import { FC } from "react"
import { ViewStyle } from "react-native"
import { Screen, Text } from "@/components"
import { DemoTabScreenProps } from "@/navigators"

interface DemoShowroomScreenProps extends DemoTabScreenProps<"Community"> {}

export const DemoShowroomScreen: FC<DemoShowroomScreenProps> = observer(function DemoShowroomScreen() {
  return (
    <Screen
      preset="scroll"
      contentContainerStyle={$container}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text text="Demo Showroom" />
    </Screen>
  )
})

const $container: ViewStyle = {
  flex: 1,
  padding: 16,
}