import React from 'react'
import { FC } from 'react'
import { ContextPicker } from './components/context-picker'
import { ContextManager } from './components/context-manager'
import { ShadowDomWrapper } from '../bos/shadow-dom-wrapper'
import { useEngine } from './contexts/engine-context'
import { Notification } from './components/notification'

export const Layout: FC = () => {
  const { viewportRef } = useEngine()

  return (
    <ShadowDomWrapper ref={viewportRef}>
      <Notification />
      <ContextPicker />
      <ContextManager />
    </ShadowDomWrapper>
  )
}
