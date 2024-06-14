import React from 'react'
import { FC } from 'react'
import { ContextPicker } from './components/context-picker'
import { ContextManager } from './components/context-manager'
import { ShadowDomWrapper } from '../bos/shadow-dom-wrapper'
import { useEngine } from './contexts/engine-context'
import { useMutableWeb } from './contexts/mutable-web-context'
import { ModalWindows } from './components/modal-windows'

export const Layout: FC = () => {
  const { viewportRef } = useEngine()
  const { engine } = useMutableWeb()

  return (
    <ShadowDomWrapper ref={viewportRef} stylesheetSrc={engine.config.bosElementStyleSrc}>
      <ContextPicker />
      <ContextManager />
      <ModalWindows />
    </ShadowDomWrapper>
  )
}
