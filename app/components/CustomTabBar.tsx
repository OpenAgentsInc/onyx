import { View, TouchableOpacity, ViewStyle } from "react-native"
import { BottomTabBarProps } from "@react-navigation/bottom-tabs"
import { Icon } from "./Icon"
import { useAppTheme } from "@/utils/useAppTheme"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const ONYX_BUTTON_SIZE = 65

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

        if (isOnyxTab) {
          return (
            <View key={route.key} style={$onyxContainer}>
              <TouchableOpacity
                onPress={onPress}
                style={$onyxButton}
              >
                <Icon
                  icon={getIconName()}
                  color={isFocused ? colors.tint : colors.tintInactive}
                  size={32}
                />
              </TouchableOpacity>
            </View>
          )
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={$tabButton}
          >
            <Icon
              icon={getIconName()}
              color={isFocused ? colors.tint : colors.tintInactive}
              size={28}
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

const $onyxContainer: ViewStyle = {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'flex-start',
}

const $onyxButton: ViewStyle = {
  backgroundColor: '#000',
  width: ONYX_BUTTON_SIZE,
  height: ONYX_BUTTON_SIZE,
  borderRadius: ONYX_BUTTON_SIZE / 2, // This ensures a perfect circle
  marginTop: -20,
  justifyContent: 'center',
  alignItems: 'center',
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