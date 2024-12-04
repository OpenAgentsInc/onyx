import { FC, useEffect, useState, useRef } from "react"
import { Text, TextStyle, Pressable } from "react-native"
import { observer } from "mobx-react-lite"
import { typography } from "@/theme/typography"
import { MessageMenu } from "./MessageMenu"

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
  const [menuVisible, setMenuVisible] = useState(false)
  const fullTextRef = useRef("")
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Update the full text reference
    fullTextRef.current = text

    // If we're getting a shorter text, reset everything
    if (text.length < displayText.length) {
      setDisplayText("")
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }

    // Function to gradually reveal text
    const revealText = () => {
      setDisplayText(prev => {
        // If we've shown everything, stop
        if (prev.length >= fullTextRef.current.length) {
          onComplete?.()
          return prev
        }

        // Show next character
        const nextText = fullTextRef.current.slice(0, prev.length + 1)
        
        // Schedule next update
        timeoutRef.current = setTimeout(revealText, 25)
        
        return nextText
      })
    }

    // If we have more text to show, schedule an update
    if (displayText.length < fullTextRef.current.length) {
      timeoutRef.current = setTimeout(revealText, 25)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [text])

  const handleDelete = () => {
    // No-op for now since we don't need deletion in TypewriterText
    setMenuVisible(false)
  }

  return (
    <>
      <Pressable 
        onLongPress={() => setMenuVisible(true)}
        delayLongPress={500}
      >
        <Text 
          style={[
            { 
              opacity: displayText ? 1 : 0,
              fontFamily: typography.primary.normal,
            },
            style,
          ]}
        >
          {displayText}
        </Text>
      </Pressable>

      <MessageMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onDelete={handleDelete}
        messageContent={displayText}
      />
    </>
  )
})