import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { EngineContext, EngineContextState, PickerTask } from './engine-context'
import { Engine } from '../../../engine'
import { InjectableTarget } from '../../../providers/provider'
import { BosRedirectMap, getRedirectMap } from '../../services/dev-server-service'

const DevModeUpdateInterval = 1500

type Props = {
  engine: Engine
  children?: ReactElement
}

const EngineProvider: FC<Props> = ({ engine, children }) => {
  const [portals, setPortals] = useState(new Map<React.FC<unknown>, InjectableTarget>())
  const [pickerTask, setPickerTask] = useState<PickerTask | null>(null)
  const [redirectMap, setRedirectMap] = useState<BosRedirectMap | null>(null)
  const [isDevMode, setIsDevMode] = useState(false)

  useEffect(() => {
    if (!isDevMode) {
      setRedirectMap(null)
      return;
    }

    let isMount = true

    const timer = setInterval(async () => {
      const redirectMap = await getRedirectMap()
      if (!isMount) return
      setRedirectMap(redirectMap)
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

  const addPortal = useCallback(<T,>(target: InjectableTarget, cmp: React.FC<T>) => {
    setPortals((prev) => new Map(prev.set(cmp as React.FC<unknown>, target)))
  }, [])

  const removePortal = useCallback(<T,>(cmp: React.FC<T>) => {
    setPortals((prev) => {
      prev.delete(cmp as React.FC<unknown>)
      return new Map(prev)
    })
  }, [])

  const state: EngineContextState = {
    engine,
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
