import { Stack } from "expo-router"
import { useAutoUpdate } from "@/lib/useAutoUpdate"
import { useFonts } from "expo-font"
import { customFontsToLoad } from "@/theme/typography"
import { useEffect, useState } from "react"

export default function RootLayout() {
  const [areFontsLoaded, fontLoadError] = useFonts(customFontsToLoad)
  useAutoUpdate()

  if (!areFontsLoaded && !fontLoadError) {
    return null
  }

  return <Stack screenOptions={{ headerShown: false }} />
}