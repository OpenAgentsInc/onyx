import { NativeStackScreenProps, createNativeStackNavigator } from "@react-navigation/native-stack"
import { CommunityScreen } from "../screens"

export type DemoTabParamList = {
  Community: undefined
}

export type DemoTabScreenProps<T extends keyof DemoTabParamList> = NativeStackScreenProps<
  DemoTabParamList,
  T
>

const Stack = createNativeStackNavigator<DemoTabParamList>()

export function DemoNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Community" component={CommunityScreen} />
    </Stack.Navigator>
  )
}