import React from 'react'
import { FC } from 'react'
import { ContextPicker } from './components/context-picker'
import { ContextManager } from './components/context-manager'
import { ShadowDomWrapper } from '../bos/shadow-dom-wrapper'
import { useEngine } from './contexts/engine-context'

export const Layout: FC = () => {
  const { engine, viewportRef } = useEngine()

  return (
    <ShadowDomWrapper ref={viewportRef} stylesheetSrc={engine.config.bosElementStyleSrc}>
      <ContextPicker />
      <ContextManager />
    </ShadowDomWrapper>
  )
}
