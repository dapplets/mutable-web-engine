import React, { ReactElement } from 'react'
import { FC } from 'react'
import { CoreProvider } from '../../react'
import { StyleSheetManager } from 'styled-components'
import { EngineConfig } from '../engine'
import { EngineProvider } from './contexts/engine-context'
import { Layout } from './layout'
import { MutableWebProvider } from './contexts/mutable-web-context'
import { ModalProvider } from './contexts/modal-context'

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
            <ModalProvider>
              <>
                <Layout />
                {children}
              </>
            </ModalProvider>
          </MutableWebProvider>
        </EngineProvider>
      </CoreProvider>
    </StyleSheetManager>
  )
}
