import React from 'react'
import { View } from 'react-native'
import Hyperview from 'hyperview'
import { behaviors, components } from '../../hyperview'
import { Logger, fetchWrapper } from '../../hyperview/helpers'
import { useStores } from '../../models'
import { Screen } from '../../components'

export function HyperviewScreen() {
  const { config } = useStores()

  return (
    <Screen preset="fixed">
      <View style={{ flex: 1 }}>
        <Hyperview
          behaviors={behaviors}
          components={components}
          entrypointUrl={`${config.api.url}/hyperview`}
          fetch={fetchWrapper}
          formatDate={(date, format) => date?.toLocaleDateString()}
          logger={new Logger(Logger.Level.log)}
        />
      </View>
    </Screen>
  )
}