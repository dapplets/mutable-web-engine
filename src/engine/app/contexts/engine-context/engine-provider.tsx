import React, { FC, ReactElement, useEffect, useState } from 'react'
import { EngineContext, EngineContextState, PickerTask } from './engine-context'
import { Engine } from '../../../engine'
import { usePortals } from './use-portals'
import { useDevMode } from './use-dev-mode'
import { useCore } from '../../../../react'

type Props = {
  engine: Engine
  children?: ReactElement
}

const EngineProvider: FC<Props> = ({ engine, children }) => {
  const { tree, attachParserConfig, updateRootContext } = useCore()

  const viewportRef = React.useRef<HTMLDivElement>(null)
  const [pickerTask, setPickerTask] = useState<PickerTask | null>(null)

  const { portals, addPortal, removePortal } = usePortals()
  const { redirectMap, enableDevMode, disableDevMode } = useDevMode()

  useEffect(() => {
    if (!tree) return

    updateRootContext({
      mutationId: engine.mutationManager.mutation?.id ?? null,
      gatewayId: engine.config.gatewayId,
    })

    // Load parser configs for root context
    // ToDo: generalize for whole context tree
    const parserConfigs = engine.mutationManager.filterSuitableParsers(tree)
    for (const config of parserConfigs) {
      attachParserConfig(config)
    }
  }, [tree])

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
