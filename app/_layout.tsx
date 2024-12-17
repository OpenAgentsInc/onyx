import * as React from "react"
import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import { useAutoUpdate } from "@/lib/useAutoUpdate"
import { customFontsToLoad } from "@/theme/typography"

export default function RootLayout() {
  const [areFontsLoaded, fontLoadError] = useFonts(customFontsToLoad)
  useAutoUpdate()

  if (!areFontsLoaded && !fontLoadError) {
    return null
  }

  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        contentStyle: {
          backgroundColor: '#000',
        }
      }} 
    />
  )
}