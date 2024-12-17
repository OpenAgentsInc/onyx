import { Text, View } from "react-native"
import { typography } from "@/theme/typography"

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
      }}
    >
      <Text
        style={{
          color: "white",
          fontFamily: typography.primary.bold,
          fontSize: 24,
        }}
      >
        Onyx
      </Text>
    </View>
  )
}
