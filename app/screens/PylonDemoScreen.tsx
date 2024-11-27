import { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite" 
import { ViewStyle } from "react-native"
import { AppStackScreenProps } from "@/navigators"
import { Screen, Text } from "@/components"
import { Api } from "@/services/api"

interface PylonDemoScreenProps extends AppStackScreenProps<"PylonDemo"> {}

export const PylonDemoScreen: FC<PylonDemoScreenProps> = observer(function PylonDemoScreen() {
  const [apiResponse, setApiResponse] = useState<string>("Loading...")
  
  useEffect(() => {
    const testApi = async () => {
      const testApiInstance = new Api({
        url: "https://pro.openagents.com",
        timeout: 10000,
      })
      
      try {
        const response = await testApiInstance.apisauce.get("/api/tester")
        setApiResponse(JSON.stringify(response.data))
      } catch (error) {
        setApiResponse(`Error: ${error.message}`)
      }
    }

    testApi()
  }, [])

  return (
    <Screen style={$root} preset="scroll">
      <Text text="Pylon API Demo" />
      <Text text={apiResponse} />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}