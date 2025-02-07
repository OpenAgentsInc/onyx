import { TouchableOpacity, Text } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useStores } from "@/models"
import { styles } from "./styles"
import { observer } from "mobx-react-lite"

type Props = {
  setOpen: (open: boolean) => void
}

export const WalletButton = observer(({ setOpen }: Props) => {
  const { walletStore } = useStores()

  const handleWalletPress = () => {
    // TODO: Navigate via HXML
    setOpen(false)
  }

  return (
    <TouchableOpacity onPress={handleWalletPress} style={styles.walletButton}>
      <MaterialCommunityIcons name="wallet-outline" size={24} color="white" />
      <Text style={styles.buttonText}>
        Wallet (₿{walletStore.balanceSat})
      </Text>
    </TouchableOpacity>
  )
})