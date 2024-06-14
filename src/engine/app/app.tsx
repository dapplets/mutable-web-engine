import React, { ReactElement, useEffect, useState } from 'react'
import { FC } from 'react'
import { CoreProvider } from '../../react'
import { StyleSheetManager } from 'styled-components'
import { Engine, EngineConfig } from '../engine'
import { EngineProvider } from './contexts/engine-context'
import { Layout } from './layout'
import { MutableWebProvider } from './contexts/mutable-web-context'

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
  // console.log(engine, 'eventEmitter app')
  if (!engine) return null
  return (
    <StyleSheetManager target={stylesMountPoint}>
      <CoreProvider event={engine.event} core={engine.core}>
        <EngineProvider engine={engine}>
          <MutableWebProvider>
            <>
              <Layout />
              {children}
            </>
          </MutableWebProvider>
        </EngineProvider>
      </CoreProvider>
    </StyleSheetManager>
  )
}
