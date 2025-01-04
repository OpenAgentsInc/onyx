import * as React from "react"
import { Text as RNText } from "react-native"
import { cn } from "@/lib/utils"
import { typography } from "@/theme"
import * as Slot from "@rn-primitives/slot"

import type { SlottableTextProps, TextRef } from "@rn-primitives/types"
const TextClassContext = React.createContext<string | undefined>(undefined)

const Text = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const textClass = React.useContext(TextClassContext)
    const Component = asChild ? Slot.Text : RNText
    return (
      <Component
        className={cn("text-base text-foreground web:select-text", textClass, className)}
        style={{ fontFamily: typography.primary.normal }}
        ref={ref}
        {...props}
      />
    )
  },
)
Text.displayName = "Text"

export { Text, TextClassContext }
