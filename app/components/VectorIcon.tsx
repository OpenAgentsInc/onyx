import { ComponentType, useEffect } from "react"
import {
  StyleProp, TouchableOpacity, TouchableOpacityProps, View, ViewProps,
  ViewStyle, Animated
} from "react-native"
import { MaterialIcons } from "@expo/vector-icons"

interface VectorIconProps extends TouchableOpacityProps {
  /**
   * The name of the icon from MaterialIcons
   */
  name: keyof typeof MaterialIcons.glyphMap

  /**
   * An optional tint color for the icon
   */
  color?: string

  /**
   * An optional size for the icon
   */
  size?: number

  /**
   * Style overrides for the icon container
   */
  containerStyle?: StyleProp<ViewStyle>

  /**
   * An optional function to be called when the icon is pressed
   */
  onPress?: TouchableOpacityProps["onPress"]

  /**
   * Whether the icon should pulse
   */
  pulse?: boolean
}

export function VectorIcon(props: VectorIconProps) {
  const {
    name,
    color,
    size = 24,
    containerStyle: $containerStyleOverride,
    pulse = false,
    ...WrapperProps
  } = props

  const isPressable = !!WrapperProps.onPress
  const Wrapper = (WrapperProps?.onPress ? TouchableOpacity : View) as ComponentType<
    TouchableOpacityProps | ViewProps
  >

  // Animation setup
  const pulseAnim = new Animated.Value(1)

  useEffect(() => {
    if (pulse) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start()
    } else {
      pulseAnim.setValue(1)
    }
  }, [pulse])

  return (
    <Wrapper
      accessibilityRole={isPressable ? "button" : undefined}
      {...WrapperProps}
      style={[
        $containerStyleOverride,
        pulse && {
          transform: [{ scale: pulseAnim }],
        },
      ]}
      activeOpacity={0.8}
    >
      <MaterialIcons name={name} size={size} color={color} />
    </Wrapper>
  )
}