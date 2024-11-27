import { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite" 
import { ViewStyle, View } from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { Screen, Text } from "@/components"
import { Api } from "@/services/api"
import { colors } from "@/theme"

interface PylonDemoScreenProps extends AppStackScreenProps<"PylonDemo"> {}

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
    <Screen style={$root} preset="scroll">
      <Text 
        text="Pylon API Demo" 
        style={$header}
      />
      <View style={$container}>
        <Text 
          text={status === "loading" ? "Loading..." : apiResponse} 
          style={[
            $responseText,
            status === "error" && $errorText
          ]}
        />
      </View>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}

const $header: ViewStyle = {
  fontSize: 24,
  fontWeight: "bold",
  padding: 16,
}

const $container: ViewStyle = {
  padding: 16,
}

const $responseText: ViewStyle = {
  fontSize: 16,
}

const $errorText: ViewStyle = {
  color: colors.error,
}