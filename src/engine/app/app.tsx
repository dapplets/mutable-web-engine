import React, { ReactElement, useEffect, useState } from 'react'
import { FC } from 'react'
import { MutableWebProvider } from '../../react'
import { StyleSheetManager } from 'styled-components'
import { Engine, EngineConfig } from '../engine'
import { EngineProvider } from './contexts/engine-context'
import { Layout } from './layout'

export const App: FC<{
  config: EngineConfig
  defaultMutationId?: string | null
  stylesMountPoint: HTMLElement
  children?: ReactElement
}> = ({ config, defaultMutationId, stylesMountPoint, children }) => {
  const [engine, setEngine] = useState<Engine | null>(null)

  // ToDo: move to EngineProvider
  useEffect(() => {
    if (!config) return
    ;(async () => {
      const engine = new Engine(config)

      console.log('Mutable Web Engine is initializing...')

      if (defaultMutationId) {
        try {
          await engine.start(defaultMutationId)
        } catch (err) {
          console.error(err)
          await engine.start()
        }
      } else {
        await engine.start()
      }

      setEngine(engine)
    })()
  }, [config, defaultMutationId])

  if (!engine) return null

  return (
    <StyleSheetManager target={stylesMountPoint}>
      <MutableWebProvider core={engine.core}>
        <EngineProvider engine={engine}>
          <Layout>{children}</Layout>
        </EngineProvider>
      </MutableWebProvider>
    </StyleSheetManager>
  )
}