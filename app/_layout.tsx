import * as React from "react"
import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import { useAutoUpdate } from "@/lib/useAutoUpdate"
import { customFontsToLoad } from "@/theme/typography"

// Add global styles to fix background and scrolling issues
const globalStyles = `
  html, body {
    margin: 0;
    padding: 0;
    background-color: #000;
    color: #fff;
    font-family: jetBrainsMonoRegular, monospace;
    height: 100%;
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  
  #root {
    height: 100%;
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  
  * {
    box-sizing: border-box;
  }
`;

export default function RootLayout() {
  const [areFontsLoaded, fontLoadError] = useFonts(customFontsToLoad)
  useAutoUpdate()

  // Inject global styles
  React.useEffect(() => {
    const styleSheet = document.createElement("style")
    styleSheet.innerText = globalStyles
    document.head.appendChild(styleSheet)
    return () => {
      document.head.removeChild(styleSheet)
    }
  }, [])

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