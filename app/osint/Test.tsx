import "@/global.css"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { useColorScheme } from "@/lib/useColorScheme"

export function Test() {
  useColorScheme()
  return (
    <Button>
      <Text>Default</Text>
    </Button>
  )
}
