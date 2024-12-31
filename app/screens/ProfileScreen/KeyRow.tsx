import { useState } from "react"
import { Text, View, TouchableOpacity } from "react-native"
import Clipboard from "@react-native-clipboard/clipboard"
import { colorsDark as colors, typography } from "@/theme"
import { MaterialCommunityIcons } from "@expo/vector-icons"

interface KeyRowProps {
  label: string
  value: string
  isSecret?: boolean
}

export const KeyRow = ({ label, value, isSecret = false }: KeyRowProps) => {
  const [showSecret, setShowSecret] = useState(false)
  const [showCopied, setShowCopied] = useState(false)

  const copyToClipboard = () => {
    Clipboard.setString(value)
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 2000) // Hide after 2 seconds
  }

  const displayValue = isSecret && !showSecret ? "••••••••••••••••••••" : value

  return (
    <View style={{ marginVertical: 8 }}>
      <Text 
        style={{ 
          color: colors.textDim, 
          fontSize: 14, 
          marginBottom: 4,
          fontFamily: typography.primary.normal,
        }}
      >
        {label}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          onLongPress={copyToClipboard}
          activeOpacity={0.7}
          style={{
            flex: 1,
            backgroundColor: colors.backgroundSecondary,
            padding: 12,
            borderRadius: 8,
            marginRight: isSecret ? 8 : 0,
            position: "relative",
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: 14,
              fontFamily: typography.primary.normal,
            }}
            numberOfLines={1}
          >
            {displayValue}
          </Text>
          {showCopied && (
            <View 
              style={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: [{ translateY: -10 }],
                backgroundColor: colors.textDim,
                padding: 4,
                borderRadius: 4,
              }}
            >
              <Text style={{ color: colors.background, fontSize: 12 }}>Copied!</Text>
            </View>
          )}
        </TouchableOpacity>
        {isSecret && (
          <TouchableOpacity
            onPress={() => setShowSecret(!showSecret)}
            activeOpacity={0.7}
            style={{
              padding: 8,
            }}
          >
            <MaterialCommunityIcons
              name={showSecret ? "eye-off" : "eye"}
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}