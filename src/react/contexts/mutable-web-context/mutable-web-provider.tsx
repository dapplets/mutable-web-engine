import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { MutableWebContext, MutableWebContextState } from './mutable-web-context'
import { Core, IContextNode, ParserConfig } from '../../../core'

type Props = {
  core: Core
  children: ReactElement
}

const MutableWebProvider: FC<Props> = ({ children, core }) => {
  const [contexts, setContexts] = useState<IContextNode[]>([])

  useEffect(() => {
    const ctxStartedSubscription = core.on('contextStarted', (e) => {
      setContexts((prev) => [...prev, e.context])
    })

    const ctxFinishedSubscription = core.on('contextFinished', (e) => {
      setContexts((prev) => prev.filter((ctx) => ctx !== e.context))
    })

    const ctxChangedSubscription = core.on('contextChanged', (e) => {
      // ToDo: no sense
      setContexts((prev) => prev.map((ctx) => (ctx === e.context ? e.context : ctx)))
    })

    return () => {
      ctxStartedSubscription.remove()
      ctxFinishedSubscription.remove()
      ctxChangedSubscription.remove()
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
    tree: core.tree,
    contexts,
    attachParserConfig,
    detachParserConfig,
  }

  return <MutableWebContext.Provider value={state}>{children}</MutableWebContext.Provider>
}

export { MutableWebProvider }
