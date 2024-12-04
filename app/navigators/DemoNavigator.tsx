import { StackScreenProps, createStackNavigator } from "@react-navigation/stack"
import { CommunityScreen } from "../screens"

export type DemoTabParamList = {
  Community: undefined
}

export type DemoTabScreenProps<T extends keyof DemoTabParamList> = StackScreenProps<
  DemoTabParamList,
  T
>

const Stack = createStackNavigator<DemoTabParamList>()

export function DemoNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Community" component={CommunityScreen} />
    </Stack.Navigator>
  )
}