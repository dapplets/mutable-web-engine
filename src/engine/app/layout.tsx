import { FC, ReactElement } from 'react'
import { ContextPicker } from './components/context-picker'
import { ContextManager } from './components/context-manager'
import React from 'react'

export const Layout: FC<{ children?: ReactElement }> = ({ children }) => {
  return (
    <>
      <ContextPicker />
      <ContextManager />
      {children}
    </>
  )
}
