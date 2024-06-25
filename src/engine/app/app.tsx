import React, { ReactElement, Fragment } from 'react'
import { FC } from 'react'
import { CoreProvider } from '../../react'
import { EngineConfig } from '../engine'
import { EngineProvider } from './contexts/engine-context'
import { MutableWebProvider } from './contexts/mutable-web-context'
import { ViewportProvider } from './contexts/viewport-context'
import { ContextPicker } from './components/context-picker'
import { ContextManager } from './components/context-manager'
import { ModalProvider } from './contexts/modal-context'

export const App: FC<{
  config: EngineConfig
  defaultMutationId?: string | null
  children?: ReactElement
}> = ({ config, defaultMutationId, children }) => {
  return (
    <ViewportProvider stylesheetSrc={config.bosElementStyleSrc}>
      <ModalProvider>
        <CoreProvider>
          <EngineProvider>
            <MutableWebProvider config={config} defaultMutationId={defaultMutationId}>
              <ContextPicker />
              <ContextManager />
              <Fragment>{children}</Fragment>
            </MutableWebProvider>
          </EngineProvider>
        </CoreProvider>
      </ModalProvider>
    </ViewportProvider>
  )
}
