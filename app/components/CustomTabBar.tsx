import { TouchableOpacity, View, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { colorsDark } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { BottomTabBarProps } from "@react-navigation/bottom-tabs"
import { Icon } from "./Icon"

const ONYX_BUTTON_SIZE = 65

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const {
    theme: { colors },
  } = useAppTheme()
  const { bottom } = useSafeAreaInsets()

  return (
    <View style={[$tabBar, { paddingBottom: bottom, height: bottom + 55 }]}>
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
            case 'Marketplace':
              return 'storefront'
            case 'Onyx':
              return 'mic'
            case 'Notifications':
              return 'notifications'
            case 'Inbox':
              return 'mail-outline'
            default:
              return 'home'
          }
        }

        if (isOnyxTab) {
          return (
            <View key={route.key} style={$onyxContainer}>
              <View style={[$onyxButtonBorder, isFocused && $onyxButtonBorderActive]}>
                <TouchableOpacity
                  onPress={onPress}
                  style={$onyxButton}
                  activeOpacity={0.8}
                >
                  <Icon
                    icon={getIconName()}
                    size={36}
                    color={isFocused ? colors.tint : colors.tintInactive}
                    style={{ borderRadius: 12, marginTop: -1 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={$tabButton}
            activeOpacity={0.8}
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
  borderTopColor: colorsDark.border,
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

const $onyxButtonBorder: ViewStyle = {
  width: ONYX_BUTTON_SIZE,
  height: ONYX_BUTTON_SIZE,
  borderRadius: ONYX_BUTTON_SIZE / 2,
  marginTop: -20,
  borderWidth: 1,
  borderColor: colorsDark.border,
  backgroundColor: 'black',
  shadowColor: "#fff",
  shadowOffset: {
    width: 0,
    height: 0,
  },
  shadowOpacity: 0.2,
  shadowRadius: 1,
  elevation: 5,
}

const $onyxButtonBorderActive: ViewStyle = {
  borderColor: '#666',
  shadowColor: "#fff",
  shadowOffset: {
    width: 0,
    height: 0,
  },
  shadowOpacity: 0.4,
  shadowRadius: 8,
  elevation: 8,
}

const $onyxButton: ViewStyle = {
  width: '100%',
  height: '100%',
  borderRadius: ONYX_BUTTON_SIZE / 2,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'black',
}
