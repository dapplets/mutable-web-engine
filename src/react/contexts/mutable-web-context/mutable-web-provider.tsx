import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { MutableWebContext, MutableWebContextState } from './mutable-web-context'
import { Core, IContextNode, ParserConfig } from '../../../core'

type Props = {
  core: Core
  children: ReactElement
}

const MutableWebProvider: FC<Props> = ({ children, core }) => {
  const [tree, setTree] = useState({ root: core.tree })

  useEffect(() => {
    // ToDo: updates whole tree, need to optimize
    const subscriptions = [
      core.on('contextStarted', () => setTree({ root: core.tree })),
      core.on('contextFinished', () => setTree({ root: core.tree })),
      core.on('contextChanged', () => setTree({ root: core.tree })),
      core.on('insertionPointStarted', () => setTree({ root: core.tree })),
      core.on('insertionPointFinished', () => setTree({ root: core.tree })),
    ]

    return () => {
      subscriptions.forEach((sub) => sub.remove())
    }
  }, [core])

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
    tree: tree.root,
    attachParserConfig,
    detachParserConfig,
  }

  return <MutableWebContext.Provider value={state}>{children}</MutableWebContext.Provider>
}

export { MutableWebProvider }
