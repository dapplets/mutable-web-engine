import { useMemo } from 'react'
import { useEngine } from './use-engine'
import { IContextNode } from '../../../../core'

export const useContextApps = (context: IContextNode) => {
  const { engine } = useEngine()

  const apps = useMemo(() => engine.mutationManager.filterSuitableApps(context), [engine, context])

  // ToDo: implement injectOnce
  // ToDo: update if new apps enabled

  return { apps }
}
