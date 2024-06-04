import { createContext } from 'react'
import { Engine } from '../../../engine'
import { ContextTarget, InjectableTarget } from '../../../providers/provider'
import { IContextNode } from '../../../../core'

export type PickerTask = {
  callback: ((context: IContextNode | null) => void) | null
  target: ContextTarget
}

export type EngineContextState = {
  engine: Engine
  portals: Map<React.FC<unknown>, InjectableTarget>
  addPortal: <T>(target: InjectableTarget, cmp: React.FC<T>) => void
  removePortal: <T>(cmp: React.FC<T>) => void
  pickerTask: PickerTask | null
  setPickerTask: (picker: PickerTask | null) => void
}

export const contextDefaultValues: EngineContextState = {
  engine: null as any as Engine, // ToDo: fix it
  portals: new Map<React.FC<unknown>, InjectableTarget>(),
  addPortal: () => undefined,
  removePortal: () => undefined,
  pickerTask: null,
  setPickerTask: () => undefined,
}

export const EngineContext = createContext<EngineContextState>(contextDefaultValues)
