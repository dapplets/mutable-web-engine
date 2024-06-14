import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { CoreContext, CoreContextState } from './core-context'
import { Core, IContextNode, ParserConfig } from '../../../core'
import { CoreEvents } from '../../../core/events'
import { EventEmitter } from '../../../core/event-emitter'
import { TreeBuilderEvents } from '../../../core/tree/pure-tree/pure-tree-builder'

type Props = {
  core: Core
  event: EventEmitter<any>
  children: ReactElement
}

const CoreProvider: FC<Props> = ({ children, core, event }) => {
  const attachParserConfig = useCallback(
    (parserConfig: ParserConfig) => {
      core.attachParserConfig(parserConfig)
    },
    [core]
  )

  const detachParserConfig = useCallback(
    (parserId: string) => {
      core.detachParserConfig(parserId)
    },
    [core]
  )

  const state: CoreContextState = {
    core,
    tree: core.tree,
    event,
    attachParserConfig,
    detachParserConfig,
  }

  return <CoreContext.Provider value={state}>{children}</CoreContext.Provider>
}

export { CoreProvider }
