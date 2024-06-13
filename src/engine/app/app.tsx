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
  return (
    <StyleSheetManager target={stylesMountPoint}>
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
    </StyleSheetManager>
  )
}
