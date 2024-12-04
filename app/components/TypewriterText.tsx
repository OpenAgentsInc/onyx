import { FC, useEffect, useState } from "react"
import { Text, TextStyle, Animated } from "react-native"
import { observer } from "mobx-react-lite"

interface TypewriterTextProps {
  text: string
  style?: TextStyle
  onComplete?: () => void
}

export const TypewriterText: FC<TypewriterTextProps> = observer(function TypewriterText({
  text,
  style,
  onComplete,
}) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    // Reset when text changes
    setDisplayText("")
    setCurrentIndex(0)

    if (!text) return

    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      } else {
        clearInterval(interval)
        onComplete?.()
      }
    }, 50) // Adjust timing as needed

    return () => clearInterval(interval)
  }, [text, onComplete])

  return (
    <Text style={[style, { opacity: displayText ? 1 : 0 }]}>
      {displayText}
    </Text>
  )
})