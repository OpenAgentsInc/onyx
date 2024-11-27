import { observer } from "mobx-react-lite"
import { FC, useEffect, useState } from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { Screen, Text } from "@/components"
import { AppStackScreenProps } from "@/navigators"
import { Api } from "@/services/api"
import { colors } from "@/theme"

interface PylonDemoScreenProps extends AppStackScreenProps<"PylonDemo"> { }

export const PylonDemoScreen: FC<PylonDemoScreenProps> = observer(function PylonDemoScreen() {
  const [status, setStatus] = useState<"loading" | "error" | "success">("loading")
  const [apiResponse, setApiResponse] = useState<string>("")

  useEffect(() => {
    const testApi = async () => {
      const testApiInstance = new Api({
        url: "https://pro.openagents.com",
        timeout: 10000,
      })

      try {
        const response = await testApiInstance.apisauce.get("/api/tester")

        if (response.ok) {
          setStatus("success")
          setApiResponse(
            typeof response.data === "object"
              ? JSON.stringify(response.data, null, 2)
              : String(response.data)
          )
        } else {
          setStatus("error")
          setApiResponse("API request failed")
        }
      } catch (error) {
        setStatus("error")
        setApiResponse("Network error - Could not reach the API")
      }
    }

    testApi()
  }, [])

  return (
    <Screen style={$contentContainer} preset="fixed">
      <Text
        text="Pylon API Demo"
      />
      <Text
        text={status === "loading" ? "Loading..." : apiResponse}
      />
    </Screen>
  )
})


const $contentContainer: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}
