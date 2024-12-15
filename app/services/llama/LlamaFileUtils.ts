import { Platform } from 'react-native'
import ReactNativeBlobUtil from 'react-native-blob-util'
import DocumentPicker from 'react-native-document-picker'
import type { DocumentPickerResponse } from 'react-native-document-picker'

export const copyFileIfNeeded = async (
  type = 'model',
  file: DocumentPickerResponse,
  addSystemMessage: (text: string) => void
): Promise<DocumentPickerResponse> => {
  if (Platform.OS === 'android' && file.uri.startsWith('content://')) {
    const dir = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/${type}s`
    const filepath = `${dir}/${file.uri.split('/').pop() || type}.gguf`

    if (!(await ReactNativeBlobUtil.fs.isDir(dir)))
      await ReactNativeBlobUtil.fs.mkdir(dir)

    if (await ReactNativeBlobUtil.fs.exists(filepath))
      return { uri: filepath } as DocumentPickerResponse

    await ReactNativeBlobUtil.fs.unlink(dir) // Clean up old files in models

    addSystemMessage(`Copying ${type} to internal storage...`)
    await ReactNativeBlobUtil.MediaCollection.copyToInternal(
      file.uri,
      filepath,
    )
    addSystemMessage(`${type} copied!`)
    return { uri: filepath } as DocumentPickerResponse
  }
  return file
}

export const pickLora = async (addSystemMessage: (text: string) => void) => {
  let loraFile
  const loraRes = await DocumentPicker.pick({
    type: Platform.OS === 'ios' ? 'public.data' : 'application/octet-stream',
  }).catch((e) => console.log('No lora file picked, error: ', e.message))
  if (loraRes?.[0]) loraFile = await copyFileIfNeeded('lora', loraRes[0], addSystemMessage)
  return loraFile
}

export const pickModel = async (addSystemMessage: (text: string) => void) => {
  const modelRes = await DocumentPicker.pick({
    type: Platform.OS === 'ios' ? 'public.data' : 'application/octet-stream',
  }).catch((e) => console.log('No model file picked, error: ', e.message))
  if (!modelRes?.[0]) return null
  return await copyFileIfNeeded('model', modelRes[0], addSystemMessage)
}