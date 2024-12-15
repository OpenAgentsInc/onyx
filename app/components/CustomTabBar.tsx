import { TouchableOpacity, View, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { colorsDark } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { BottomTabBarProps } from "@react-navigation/bottom-tabs"
import { Icon } from "./Icon"
import { useAudioRecorder } from "@/hooks/useAudioRecorder"
import { useCallback } from "react"

const ONYX_BUTTON_SIZE = 65

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const {
    theme: { colors },
  } = useAppTheme()
  const { bottom } = useSafeAreaInsets()
  const { isRecording, toggleRecording } = useAudioRecorder()

  const handlePress = useCallback(async () => {
    await toggleRecording()
  }, [toggleRecording])

  return (
    <View style={[$tabBar, { paddingBottom: bottom, height: bottom + 55 }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const isFocused = state.index === index
        const isOnyxTab = route.name === 'Onyx'

        if (!isOnyxTab) return null

        return (
          <View key={route.key} style={$onyxContainer}>
            <View style={[$onyxButtonBorder, isFocused && $onyxButtonBorderActive]}>
              <TouchableOpacity
                onPress={handlePress}
                style={[$onyxButton, isRecording && $onyxButtonRecording]}
                activeOpacity={0.8}
              >
                <Icon
                  icon="mic"
                  size={36}
                  color={isRecording ? colors.error : (isFocused ? colors.tint : colors.tintInactive)}
                  style={{ borderRadius: 12, marginTop: -1 }}
                />
              </TouchableOpacity>
            </View>
          </View>
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

const $onyxButtonRecording: ViewStyle = {
  backgroundColor: '#330000',
}