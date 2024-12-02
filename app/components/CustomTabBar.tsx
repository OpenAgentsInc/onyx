import { View, TouchableOpacity, ViewStyle } from "react-native"
import { BottomTabBarProps } from "@react-navigation/bottom-tabs"
import { Icon } from "./Icon"
import { useAppTheme } from "@/utils/useAppTheme"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const {
    theme: { colors },
  } = useAppTheme()
  const { bottom } = useSafeAreaInsets()

  return (
    <View style={[$tabBar, { paddingBottom: bottom, height: bottom + 65 }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const isFocused = state.index === index

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }

        // Determine if this is the middle (Onyx) tab
        const isOnyxTab = route.name === 'Onyx'

        // Get the appropriate icon name based on the route
        const getIconName = () => {
          switch (route.name) {
            case 'Home':
              return 'home'
            case 'Community':
              return 'groups'
            case 'Onyx':
              return 'mic'
            case 'Wallet':
              return 'account-balance-wallet'
            case 'Profile':
              return 'person'
            default:
              return 'home'
          }
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={[
              $tabButton,
              isOnyxTab && $onyxButton,
            ]}
          >
            <Icon
              icon={getIconName()}
              color={isFocused ? colors.tint : colors.tintInactive}
              size={isOnyxTab ? 32 : 28}
            />
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const $tabBar: ViewStyle = {
  flexDirection: 'row',
  backgroundColor: 'black',
  borderTopColor: '#333',
  borderTopWidth: 1,
  position: 'relative',
}

const $tabButton: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 8,
}

const $onyxButton: ViewStyle = {
  backgroundColor: '#000',
  width: 65,
  height: 65,
  borderRadius: 32.5,
  marginTop: -20,
  borderWidth: 1,
  borderColor: '#333',
  shadowColor: "#fff",
  shadowOffset: {
    width: 0,
    height: 0,
  },
  shadowOpacity: 0.2,
  shadowRadius: 5,
  elevation: 5,
}