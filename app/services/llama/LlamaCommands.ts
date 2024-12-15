import json5 from 'json5'
import ReactNativeBlobUtil from 'react-native-blob-util'
import { pickLora } from './LlamaFileUtils'
import type { LlamaContext } from './LlamaTypes'

const { dirs } = ReactNativeBlobUtil.fs

export const handleCommand = async (
  command: string,
  context: LlamaContext,
  inferencing: boolean,
  addSystemMessage: (text: string, metadata?: any) => void,
  resetConversation: () => void
): Promise<boolean> => {
  switch (command) {
    case '/info':
      addSystemMessage(
        `// Model Info\n${json5.stringify(context.model, null, 2)}`,
        { copyable: true }
      )
      return true

    case '/bench':
      addSystemMessage('Heating up the model...')
      const t0 = Date.now()
      await context.bench(8, 4, 1, 1)
      const tHeat = Date.now() - t0
      if (tHeat > 1e4) {
        addSystemMessage('Heat up time is too long, please try again.')
        return true
      }
      addSystemMessage(`Heat up time: ${tHeat}ms`)

      addSystemMessage('Benchmarking the model...')
      const {
        modelDesc,
        modelSize,
        modelNParams,
        ppAvg,
        ppStd,
        tgAvg,
        tgStd,
      } = await context.bench(512, 128, 1, 3)

      const size = `${(modelSize / 1024.0 / 1024.0 / 1024.0).toFixed(2)} GiB`
      const nParams = `${(modelNParams / 1e9).toFixed(2)}B`
      const md =
        '| model | size | params | test | t/s |\n' +
        '| --- | --- | --- | --- | --- |\n' +
        `| ${modelDesc} | ${size} | ${nParams} | pp 512 | ${ppAvg.toFixed(2)} ± ${ppStd.toFixed(2)} |\n` +
        `| ${modelDesc} | ${size} | ${nParams} | tg 128 | ${tgAvg.toFixed(2)} ± ${tgStd.toFixed(2)}`
      addSystemMessage(md, { copyable: true })
      return true

    case '/stop':
      if (inferencing) context.stopCompletion()
      return true

    case '/reset':
      resetConversation()
      addSystemMessage('Conversation reset!')
      return true

    case '/save-session':
      try {
        const tokensSaved = await context.saveSession(`${dirs.DocumentDir}/llama-session.bin`)
        console.log('Session tokens saved:', tokensSaved)
        addSystemMessage(`Session saved! ${tokensSaved} tokens saved.`)
      } catch (e: any) {
        console.log('Session save failed:', e)
        addSystemMessage(`Session save failed: ${e.message}`)
      }
      return true

    case '/load-session':
      try {
        const details = await context.loadSession(`${dirs.DocumentDir}/llama-session.bin`)
        console.log('Session loaded:', details)
        addSystemMessage(`Session loaded! ${details.tokens_loaded} tokens loaded.`)
      } catch (e: any) {
        console.log('Session load failed:', e)
        addSystemMessage(`Session load failed: ${e.message}`)
      }
      return true

    case '/lora':
      try {
        const loraFile = await pickLora(addSystemMessage)
        if (loraFile) {
          await context.applyLoraAdapters([{ path: loraFile.uri }])
          const loraList = await context.getLoadedLoraAdapters()
          addSystemMessage(`Loaded lora adapters: ${JSON.stringify(loraList)}`)
        }
      } catch (e: any) {
        addSystemMessage(`Lora operation failed: ${e.message}`)
      }
      return true

    case '/remove-lora':
      await context.removeLoraAdapters()
      addSystemMessage('Lora adapters removed!')
      return true

    case '/lora-list':
      const loraList = await context.getLoadedLoraAdapters()
      addSystemMessage(`Loaded lora adapters: ${JSON.stringify(loraList)}`)
      return true

    default:
      return false
  }
}