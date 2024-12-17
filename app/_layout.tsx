import { Stack } from "expo-router"
import { useAutoUpdate } from "@/lib/useAutoUpdate"

export default function RootLayout() {
  useAutoUpdate()
  return <Stack />;
}
