import { View } from 'react-native'
import { WebView } from 'react-native-webview'

interface DOMWrapperProps {
  children: React.ReactNode
}

export default function DOMWrapper({ children }: DOMWrapperProps) {
  // Convert React elements to HTML string
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style>
          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            overflow: hidden;
            background-color: transparent;
          }
          #root {
            height: 100%;
            width: 100%;
          }
        </style>
      </head>
      <body>
        <div id="root"></div>
      </body>
    </html>
  `

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ html }}
        style={{ flex: 1, backgroundColor: 'transparent' }}
        onMessage={(event) => {
          // Handle messages from web content
          console.log('Message from web:', event.nativeEvent.data)
        }}
      />
    </View>
  )
}