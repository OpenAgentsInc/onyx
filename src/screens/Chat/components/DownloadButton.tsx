import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { typography } from '@/theme'
import { useModelStore } from '@/store/useModelStore'

interface DownloadButtonProps {
  onPress: () => void
}

export const DownloadButton = ({ onPress }: DownloadButtonProps) => {
  const { status, progress } = useModelStore()
  const downloading = status === 'downloading'

  return (
    <View style={{ padding: 10, paddingBottom: 50, backgroundColor: '#000' }}>
      <Pressable onPress={onPress} disabled={downloading}>
        <View style={{ backgroundColor: '#444', padding: 10, borderRadius: 5 }}>
          <Text style={{ color: 'white', textAlign: 'center', fontFamily: typography.primary.normal }}>
            {downloading ? `Downloading... ${progress}%` : 'Download & Load Model'}
          </Text>
        </View>
      </Pressable>
    </View>
  )
}