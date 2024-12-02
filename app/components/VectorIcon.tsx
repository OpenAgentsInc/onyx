import { ComponentType } from "react"
import {
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
  ViewStyle,
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
}

export function VectorIcon(props: VectorIconProps) {
  const {
    name,
    color,
    size = 24,
    containerStyle: $containerStyleOverride,
    ...WrapperProps
  } = props

  const isPressable = !!WrapperProps.onPress
  const Wrapper = (WrapperProps?.onPress ? TouchableOpacity : View) as ComponentType<
    TouchableOpacityProps | ViewProps
  >

  return (
    <Wrapper
      accessibilityRole={isPressable ? "button" : undefined}
      {...WrapperProps}
      style={$containerStyleOverride}
    >
      <MaterialIcons name={name} size={size} color={color} />
    </Wrapper>
  )
}