import { FC, useEffect, useState } from "react"
import { Text, TextStyle } from "react-native"
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
  const [displayedWords, setDisplayedWords] = useState<string[]>([])
  const words = text.split(" ")

  useEffect(() => {
    setDisplayedWords([]) // Reset when text changes
    let currentIndex = 0

    const interval = setInterval(() => {
      if (currentIndex < words.length) {
        setDisplayedWords(prev => [...prev, words[currentIndex]])
        currentIndex++
      } else {
        clearInterval(interval)
        onComplete?.()
      }
    }, 150) // Adjust timing as needed

    return () => clearInterval(interval)
  }, [text, words, onComplete])

  return (
    <Text style={style}>
      {displayedWords.map((word, index) => (
        <Text
          key={index}
          style={{
            opacity: 1,
          }}
        >
          {word}
          {index < displayedWords.length - 1 ? " " : ""}
        </Text>
      ))}
    </Text>
  )
})