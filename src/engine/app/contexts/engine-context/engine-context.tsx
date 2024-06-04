import { createContext } from 'react'
import { Engine } from '../../../engine'
import { InjectableTarget } from '../../../providers/provider'
import { IContextNode } from '../../../../core'

export type EngineContextState = {
  engine: Engine
  portals: Map<React.FC<unknown>, InjectableTarget>
  addPortal: <T>(target: InjectableTarget, cmp: React.FC<T>) => void
  removePortal: <T>(cmp: React.FC<T>) => void
  pickerCallback: ((context: IContextNode | null) => void) | null
  setPickerCallback: (callback: ((context: IContextNode | null) => void) | null) => void
}

export const contextDefaultValues: EngineContextState = {
  engine: null as any as Engine, // ToDo: fix it
  portals: new Map<React.FC<unknown>, InjectableTarget>(),
  addPortal: () => undefined,
  removePortal: () => undefined,
  pickerCallback: null,
  setPickerCallback: () => undefined,
}

export const EngineContext = createContext<EngineContextState>(contextDefaultValues)
