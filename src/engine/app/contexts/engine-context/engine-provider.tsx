import React, { FC, ReactElement, useEffect, useState } from 'react'
import { EngineContext, EngineContextState, PickerTask } from './engine-context'
import { usePortals } from './use-portals'
import { useDevMode } from './use-dev-mode'

type Props = {
  children?: ReactElement
}

const EngineProvider: FC<Props> = ({ children }) => {
  const [pickerTask, setPickerTask] = useState<PickerTask | null>(null)

  const { portals, addPortal, removePortal } = usePortals()
  const { redirectMap, enableDevMode, disableDevMode } = useDevMode()

  useEffect(() => {
    console.log('[MutableWeb] Dev mode:', {
      enableDevMode,
      disableDevMode,
    })
  }, [enableDevMode, disableDevMode])

  const state: EngineContextState = {
    portals,
    addPortal,
    removePortal,
    pickerTask,
    setPickerTask,
    redirectMap,
    enableDevMode,
    disableDevMode,
  }

  return <EngineContext.Provider value={state}>{children}</EngineContext.Provider>
}

export { EngineProvider }
