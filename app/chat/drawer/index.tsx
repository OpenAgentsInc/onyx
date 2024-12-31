import { observer } from "mobx-react-lite"
import { useEffect } from "react"
import { View } from "react-native"
import { useStores } from "@/models"
import { styles } from "./styles"
import { NewChatButton } from "./NewChatButton"
import { ChatList } from "./ChatList"
import { WalletButton } from "./WalletButton"

type Props = {
  drawerInsets: any // replace any with the correct type
  setOpen: (open: boolean) => void
}

export const ChatDrawerContent = observer(({ drawerInsets, setOpen }: Props) => {
  const { chatStore } = useStores()

  useEffect(() => {
    chatStore.loadAllChats()
  }, [])

  return (
    <View style={[styles.container, drawerInsets]}>
      <View style={styles.topSection}>
        <NewChatButton setOpen={setOpen} />
      </View>

      <ChatList setOpen={setOpen} />

      <View style={styles.bottomSection}>
        <WalletButton setOpen={setOpen} />
      </View>
    </View>
  )
})

export { ChatDrawerLayout } from "./ChatDrawerLayout"