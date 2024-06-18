import { createContext } from 'react'
import { IContextNode } from '../../../../core'
import { BosRedirectMap } from '../../services/dev-server-service'
import { Target } from '../../services/target/target.entity'

export type InjectableTarget = Target & {
  injectTo: string
}

export type PickerTask = {
  target?: Target | Target[]
  callback?: ((context: IContextNode | null) => void) | null
  styles?: React.CSSProperties
  highlightChildren?: boolean
}

export type EngineContextState = {
  viewportRef: React.RefObject<HTMLDivElement>
  portals: Map<string, { component: React.FC<unknown>; target: InjectableTarget }>
  addPortal: <T>(key: string, target: InjectableTarget, cmp: React.FC<T>) => void
  removePortal: <T>(key: string) => void
  pickerTask: PickerTask | null
  setPickerTask: (picker: PickerTask | null) => void
  redirectMap: BosRedirectMap | null
  enableDevMode: () => void
  disableDevMode: () => void
}

export const contextDefaultValues: EngineContextState = {
  viewportRef: null as any as React.RefObject<HTMLDivElement>,
  portals: new Map(),
  addPortal: () => undefined,
  removePortal: () => undefined,
  pickerTask: null,
  setPickerTask: () => undefined,
  redirectMap: null,
  enableDevMode: () => undefined,
  disableDevMode: () => undefined,
}

export const EngineContext = createContext<EngineContextState>(contextDefaultValues)
