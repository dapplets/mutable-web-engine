import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { EngineContext, EngineContextState } from './engine-context'
import { Engine } from '../../../engine'
import { InjectableTarget } from '../../../providers/provider'
import { IContextNode } from '../../../../core'

type Props = {
  engine: Engine
  children?: ReactElement
}

const EngineProvider: FC<Props> = ({ engine, children }) => {
  const [portals, setPortals] = useState(new Map<React.FC<unknown>, InjectableTarget>())
  const [pickerCallback, setPickerCallback] = useState<
    ((context: IContextNode | null) => void) | null
  >(null)

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
    pickerCallback,
    setPickerCallback,
  }

  return <EngineContext.Provider value={state}>{children}</EngineContext.Provider>
}

export { EngineProvider }
