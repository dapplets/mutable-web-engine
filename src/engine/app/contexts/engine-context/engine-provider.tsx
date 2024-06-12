import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { EngineContext, EngineContextState, PickerTask } from './engine-context'
import { Engine } from '../../../engine'
import { InjectableTarget } from '../../../providers/provider'
import { BosRedirectMap, getRedirectMap } from '../../services/dev-server-service'
import stringify from 'json-stringify-deterministic'

const DevModeUpdateInterval = 1500

type Props = {
  engine: Engine
  children?: ReactElement
}

const EngineProvider: FC<Props> = ({ engine, children }) => {
  const viewportRef = React.useRef<HTMLDivElement>(null)
  const [portals, setPortals] = useState(
    new Map<string, { component: React.FC<unknown>; target: InjectableTarget }>()
  )
  const [pickerTask, setPickerTask] = useState<PickerTask | null>(null)
  const [redirectMap, setRedirectMap] = useState<BosRedirectMap | null>(null)
  const [isDevMode, setIsDevMode] = useState(false)

  useEffect(() => {
    if (!isDevMode) {
      setRedirectMap(null)
      return
    }

    let isMount = true

    const timer = setInterval(async () => {
      const newRedirectMap = await getRedirectMap()
      if (!isMount) return

      // prevents rerendering
      setRedirectMap((prev) =>
        stringify(prev) !== stringify(newRedirectMap) ? newRedirectMap : prev
      )
    }, DevModeUpdateInterval)

    return () => {
      isMount = false
      clearInterval(timer)
    }
  }, [isDevMode])

  const enableDevMode = useCallback(() => {
    setIsDevMode(true)
  }, [])

  const disableDevMode = useCallback(() => {
    setIsDevMode(false)
  }, [])

  const addPortal = useCallback(
    <T,>(key: string, target: InjectableTarget, component: React.FC<T>) => {
      setPortals(
        (prev) => new Map(prev.set(key, { component: component as React.FC<unknown>, target }))
      )
    },
    []
  )

  const removePortal = useCallback((key: string) => {
    setPortals((prev) => {
      prev.delete(key)
      return new Map(prev)
    })
  }, [])

  const state: EngineContextState = {
    engine,
    viewportRef,
    portals,
    addPortal,
    removePortal,
    pickerTask,
    setPickerTask,
    redirectMap,
    enableDevMode,
    disableDevMode,
  }

  useEffect(() => {
    console.log('engine context', state)
  }, [])

  return <EngineContext.Provider value={state}>{children}</EngineContext.Provider>
}

export { EngineProvider }
