import { useState } from "react"
import { Image, TouchableOpacity, View } from "react-native"
import { styles } from "./styles"
import { TextInputModal } from "./TextInputModal"
import { VoiceInputModal } from "./VoiceInputModal"
import { ConfigureModal } from "./ConfigureModal"
import { DownloadModal } from "./DownloadModal"

export const OnyxLayout = () => {
  const [showTextInput, setShowTextInput] = useState(false)
  const [showVoiceInput, setShowVoiceInput] = useState(false)
  const [showConfigureModal, setShowConfigureModal] = useState(false)

  const handleTextPress = () => {
    setShowTextInput(true)
  }

  const handleVoicePress = () => {
    setShowVoiceInput(true)
  }

  const handleConfigurePress = () => {
    setShowConfigureModal(true)
  }

  const handleTextSend = (text: string) => {
    // TODO: Handle sending text message
    console.log("Sending text:", text)
  }

  const handleVoiceSend = (transcribedText: string) => {
    // Handle the transcribed text the same way as text input
    console.log("Sending transcribed text:", transcribedText)
    handleTextSend(transcribedText)
  }

  return (
    <View style={{ flex: 1 }}>
      <TextInputModal
        visible={showTextInput}
        onClose={() => setShowTextInput(false)}
        onSend={handleTextSend}
      />

      <VoiceInputModal
        visible={showVoiceInput}
        onClose={() => setShowVoiceInput(false)}
        onSend={handleVoiceSend}
      />

      <ConfigureModal
        visible={showConfigureModal}
        onClose={() => setShowConfigureModal(false)}
      />

      <DownloadModal />

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleConfigurePress}
        style={[styles.configureButton, { pointerEvents: "box-none" }]}
      >
        <Image
          source={require("../../assets/icons/configure.png")}
          style={{ width: "100%", height: "100%" }}
        />
      </TouchableOpacity>

      <View style={styles.bottomButtons}>
        <TouchableOpacity activeOpacity={0.8} onPress={handleTextPress}>
          <Image source={require("../../assets/icons/text.png")} style={styles.iconButton} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} onPress={handleVoicePress}>
          <Image source={require("../../assets/icons/voice.png")} style={styles.iconButton} />
        </TouchableOpacity>
      </View>
    </View>
  )
}