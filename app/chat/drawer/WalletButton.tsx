import { TouchableOpacity, Text } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "@/models"
import { styles } from "./styles"

type Props = {
  setOpen: (open: boolean) => void
}

export const WalletButton = ({ setOpen }: Props) => {
  const navigation = useNavigation()
  const { walletStore } = useStores()

  const handleWalletPress = () => {
    navigation.navigate("Wallet" as never)
    setOpen(false)
  }

  return (
    <TouchableOpacity onPress={handleWalletPress} style={styles.walletButton}>
      <MaterialCommunityIcons name="wallet-outline" size={24} color="white" />
      <Text style={styles.buttonText}>
        Wallet (₿{walletStore.balanceSat}; {walletStore.nostrKeys?.npub.slice(0, 12)})
      </Text>
    </TouchableOpacity>
  )
}