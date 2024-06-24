import React, { ReactElement } from 'react'
import { FC } from 'react'
import { CoreProvider } from '../../react'
import { EngineConfig } from '../engine'
import { EngineProvider } from './contexts/engine-context'
import { Layout } from './layout'
import { MutableWebProvider } from './contexts/mutable-web-context'

export const App: FC<{
  config: EngineConfig
  defaultMutationId?: string | null
  children?: ReactElement
}> = ({ config, defaultMutationId, children }) => {
  return (
    <CoreProvider>
      <EngineProvider>
        <MutableWebProvider config={config} defaultMutationId={defaultMutationId}>
          <>
            <Layout />
            {children}
          </>
        </MutableWebProvider>
      </EngineProvider>
    </CoreProvider>
  )
}
