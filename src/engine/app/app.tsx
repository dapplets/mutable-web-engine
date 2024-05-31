import React from 'react'
import { FC } from 'react'
import { Core } from '../../core'
import { MutableWebProvider } from '../../react'
import { ContextPicker } from './components/context-picker'
import { StyleSheetManager } from 'styled-components'

export const App: FC<{ core: Core; stylesMountPoint: HTMLElement }> = ({
  core,
  stylesMountPoint,
}) => {
  return (
    <StyleSheetManager target={stylesMountPoint}>
      <MutableWebProvider core={core}>
        <ContextPicker />
      </MutableWebProvider>
    </StyleSheetManager>
  )
}
