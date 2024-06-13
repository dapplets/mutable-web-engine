import React, { FC, ReactElement, useState } from 'react'
import { EngineContext, EngineContextState, PickerTask } from './engine-context'
import { usePortals } from './use-portals'
import { useDevMode } from './use-dev-mode'

type Props = {
  children?: ReactElement
}

const EngineProvider: FC<Props> = ({ children }) => {
  const viewportRef = React.useRef<HTMLDivElement>(null)
  const [pickerTask, setPickerTask] = useState<PickerTask | null>(null)

  const { portals, addPortal, removePortal } = usePortals()
  const { redirectMap, enableDevMode, disableDevMode } = useDevMode()

  const state: EngineContextState = {
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

  return <EngineContext.Provider value={state}>{children}</EngineContext.Provider>
}

export { EngineProvider }
