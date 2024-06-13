import React, { FC, ReactElement, useEffect, useRef, useState } from 'react'
import { EngineContext, EngineContextState, PickerTask } from './engine-context'
import { Engine, EngineConfig } from '../../../engine'
import { usePortals } from './use-portals'
import { useDevMode } from './use-dev-mode'
import { useCore } from '../../../../react'

type Props = {
  config: EngineConfig
  defaultMutationId?: string | null
  children?: ReactElement
}

const EngineProvider: FC<Props> = ({ config, defaultMutationId, children }) => {
  const { core, tree, attachParserConfig, updateRootContext } = useCore()
  const [engine, setEngine] = useState<Engine | null>(null)

  const viewportRef = React.useRef<HTMLDivElement>(null)
  const [pickerTask, setPickerTask] = useState<PickerTask | null>(null)

  const { portals, addPortal, removePortal } = usePortals()
  const { redirectMap, enableDevMode, disableDevMode } = useDevMode()

  useEffect(() => {
    ;(async () => {
      const engine = new Engine(core, config)

      console.log('Mutable Web Engine is initializing...')

      if (defaultMutationId) {
        try {
          await engine.start(defaultMutationId)
        } catch (err) {
          console.error(err)
          await engine.start()
        }
      } else {
        await engine.start()
      }

      setEngine(engine)
    })()
  }, [defaultMutationId])

  useEffect(() => {
    if (!tree || !engine) return

    updateRootContext({
      mutationId: engine.mutation?.id ?? null,
      gatewayId: engine.config.gatewayId,
    })

    // Load parser configs for root context
    // ToDo: generalize for whole context tree
    const parserConfigs = engine.mutationManager.filterSuitableParsers(tree)
    for (const config of parserConfigs) {
      attachParserConfig(config)
    }
  }, [engine, tree])

  useEffect(() => {
    if (!engine) return
    console.log('engine context', {
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
    })
  }, [engine])

  if (!engine) return null

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

  return <EngineContext.Provider value={state}>{children}</EngineContext.Provider>
}

export { EngineProvider }
