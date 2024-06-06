import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { MutableWebContext, MutableWebContextState } from './mutable-web-context'
import { Core, IContextNode, ParserConfig } from '../../../core'

type Props = {
  core: Core
  children: ReactElement
}

const MutableWebProvider: FC<Props> = ({ children, core }) => {
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

  const state: MutableWebContextState = {
    core,
    tree: core.tree,
    attachParserConfig,
    detachParserConfig,
  }

  return <MutableWebContext.Provider value={state}>{children}</MutableWebContext.Provider>
}

export { MutableWebProvider }
