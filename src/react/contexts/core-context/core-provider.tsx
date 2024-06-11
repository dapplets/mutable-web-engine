import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { CoreContext, CoreContextState } from './core-context'
import { Core, IContextNode, ParserConfig } from '../../../core'

type Props = {
  core: Core
  children: ReactElement
}

const CoreProvider: FC<Props> = ({ children, core }) => {
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
    attachParserConfig,
    detachParserConfig,
  }

  return <CoreContext.Provider value={state}>{children}</CoreContext.Provider>
}

export { CoreProvider }
