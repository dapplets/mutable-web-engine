import React, { ReactElement } from 'react'
import React, { ReactElement } from 'react'
import { FC } from 'react'
import { CoreProvider } from '../../react'
import { EngineConfig } from '../engine'
import { EngineProvider } from './contexts/engine-context'
import { MutableWebProvider } from './contexts/mutable-web-context'
import { ViewportProvider } from './contexts/viewport-context'
import { ContextPicker } from './components/context-picker'
import { ContextManager } from './components/context-manager'

export const App: FC<{
  config: EngineConfig
  defaultMutationId?: string | null
  children?: ReactElement
}> = ({ config, defaultMutationId, children }) => {
  return (
    <StyleSheetManager target={stylesMountPoint}>
      <CoreProvider>
        <EngineProvider>
          <MutableWebProvider config={config} defaultMutationId={defaultMutationId}>
            <ViewportProvider stylesheetSrc={config.bosElementStyleSrc}>
              <ContextPicker />
              <ContextManager />
            </ViewportProvider>
            <React.Fragment>{children}</React.Fragment>
          </MutableWebProvider>
        </EngineProvider>
      </CoreProvider>
    </StyleSheetManager>
  )
}
