import { useState } from "react"
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { styles } from "./styles"
import { TextChat } from "./TextChat"
import { VoiceChat } from "./VoiceChat"
import { ConfigureModal } from "./ConfigureModal"
import { DownloadModal } from "./DownloadModal"
import { useChatStore } from "./hooks/useChatStore"
import { observer } from "mobx-react-lite"

export const OnyxLayout = observer(() => {
  const [showConfigureModal, setShowConfigureModal] = useState(false)
  const { conversationMessages, isInferencing } = useChatStore()

  const handleConfigurePress = () => {
    setShowConfigureModal(true)
  }

  return (
    <TextChat>
      {({ showTextModal: handleTextPress }) => (
        <VoiceChat>
          {({ showVoiceModal: handleVoicePress }) => (
            <View style={styles.container}>
              {/* Messages */}
              <ScrollView 
                style={styles.messagesContainer}
                contentContainerStyle={styles.messagesContent}
                inverted
              >
                {conversationMessages.map((message) => (
                  <View 
                    key={message.id}
                    style={[
                      styles.messageContainer,
                      message.role === "user" ? styles.userMessage : styles.assistantMessage
                    ]}
                  >
                    <Text style={styles.messageText}>{message.text}</Text>
                    {message.metadata?.timings && (
                      <Text style={styles.timingText}>{message.metadata.timings}</Text>
                    )}
                  </View>
                ))}
              </ScrollView>

              {/* Configure Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleConfigurePress}
                style={styles.configureButton}
                disabled={isInferencing}
              >
                <Image
                  source={require("../../assets/icons/configure.png")}
                  style={[
                    styles.configureImage,
                    isInferencing && styles.disabledButton
                  ]}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              {/* Bottom Buttons */}
              <View style={styles.bottomButtons}>
                <TouchableOpacity 
                  activeOpacity={0.8} 
                  onPress={handleTextPress}
                  disabled={isInferencing}
                >
                  <Image 
                    source={require("../../assets/icons/text.png")} 
                    style={[
                      styles.iconButton,
                      isInferencing && styles.disabledButton
                    ]}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <TouchableOpacity 
                  activeOpacity={0.8} 
                  onPress={handleVoicePress}
                  disabled={isInferencing}
                >
                  <Image 
                    source={require("../../assets/icons/voice.png")} 
                    style={[
                      styles.iconButton,
                      isInferencing && styles.disabledButton
                    ]}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>

              {/* Modals */}
              <ConfigureModal
                visible={showConfigureModal}
                onClose={() => setShowConfigureModal(false)}
              />

              <DownloadModal />
            </View>
          )}
        </VoiceChat>
      )}
    </TextChat>
  )
})