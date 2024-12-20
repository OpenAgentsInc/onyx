import React, { useState } from 'react'
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native'
import { typography } from '@/theme'
import { AVAILABLE_MODELS } from '../constants'
import { useModelStore } from '@/store/useModelStore'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export const ModelSwitcher = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const { selectedModelKey, selectModel, startDownload, status } = useModelStore()
  const currentModel = AVAILABLE_MODELS[selectedModelKey]

  const handleModelSelect = (modelKey: string) => {
    console.log('Switching to model:', modelKey)
    if (modelKey !== selectedModelKey) {
      selectModel(modelKey)
      startDownload() // Start download immediately
    }
    setModalVisible(false)
  }

  // Get icon based on status
  const getIcon = () => {
    switch (status) {
      case 'downloading':
        return 'download'
      case 'initializing':
        return 'cog-sync'
      case 'ready':
        return 'chip'
      case 'error':
        return 'alert'
      case 'releasing':
        return 'cog-refresh'
      default:
        return 'chip'
    }
  }

  return (
    <>
      <Pressable 
        onPress={() => setModalVisible(true)}
        style={styles.button}
        disabled={status === 'downloading' || status === 'initializing' || status === 'releasing'}
      >
        <Icon 
          name={getIcon()} 
          size={24} 
          color="white"
          style={status === 'initializing' || status === 'releasing' ? styles.spinning : undefined}
        />
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Switch Model</Text>
            <Text style={styles.currentModel}>
              Current: {currentModel.displayName}
              {status !== 'ready' && ` (${status})`}
            </Text>
            
            {Object.entries(AVAILABLE_MODELS).map(([key, model]) => (
              <Pressable
                key={key}
                style={[
                  styles.modelOption,
                  key === selectedModelKey && styles.selectedOption
                ]}
                onPress={() => handleModelSelect(key)}
                disabled={status === 'downloading' || status === 'initializing' || status === 'releasing'}
              >
                <Text style={[
                  styles.modelText,
                  key === selectedModelKey && styles.selectedText
                ]}>
                  {model.displayName}
                </Text>
              </Pressable>
            ))}

            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    marginRight: 8,
  },
  spinning: {
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    color: 'white',
    fontSize: 20,
    fontFamily: typography.primary.normal,
    marginBottom: 10,
    textAlign: 'center',
  },
  currentModel: {
    color: '#888',
    fontSize: 14,
    fontFamily: typography.primary.normal,
    marginBottom: 20,
    textAlign: 'center',
  },
  modelOption: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    backgroundColor: '#333',
  },
  selectedOption: {
    backgroundColor: '#666',
  },
  modelText: {
    color: 'white',
    fontSize: 16,
    fontFamily: typography.primary.normal,
    textAlign: 'center',
  },
  selectedText: {
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#444',
    borderRadius: 8,
  },
  closeText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: typography.primary.normal,
  },
})