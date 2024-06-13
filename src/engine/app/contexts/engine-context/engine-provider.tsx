import React, { FC, ReactElement, useEffect, useState } from 'react'
import { EngineContext, EngineContextState, PickerTask } from './engine-context'
import { Engine } from '../../../engine'
import { usePortals } from './use-portals'
import { useDevMode } from './use-dev-mode'

type Props = {
  engine: Engine
  children?: ReactElement
}

const EngineProvider: FC<Props> = ({ engine, children }) => {
  const viewportRef = React.useRef<HTMLDivElement>(null)
  const [pickerTask, setPickerTask] = useState<PickerTask | null>(null)

  const { portals, addPortal, removePortal } = usePortals()
  const { redirectMap, enableDevMode, disableDevMode } = useDevMode()

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
