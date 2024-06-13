import { FC, ReactElement, useEffect } from 'react'
import { ContextPicker } from './components/context-picker'
import { ContextManager } from './components/context-manager'
import React from 'react'
import { EventEmitter } from '../../core/event-emitter'
import { TreeBuilderEvents } from '../../core/tree/pure-tree/pure-tree-builder'
import { Notification } from './components/notification'
import { ShadowDomWrapper } from '../bos/shadow-dom-wrapper'

export const Layout: FC<{ children?: ReactElement; _events?: EventEmitter<TreeBuilderEvents> }> = ({
  children,
  _events,
}) => {
  return (
    <>
      <Notification />
      <ContextPicker />
      <ContextManager />
      {children}
    </>
  )
}
