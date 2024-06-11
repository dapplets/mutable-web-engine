import { useMemo } from 'react'
import { useEngine } from './use-engine'
import { IContextNode } from '../../../../core'
import { MutationManager } from '../../../mutation-manager'

export const usePortals = (context: IContextNode, insPointName?: string) => {
  const { portals } = useEngine()

  const components = useMemo(() => {
    // ToDo: improve readability
    return Array.from(portals.entries())
      .filter(
        ([, { target }]) =>
          MutationManager._isTargetMet(target, context) && target.injectTo === insPointName
      )
      .map(([key, { component, target }]) => ({
        key,
        target,
        component,
      }))
      .sort((a, b) => (b.key > a.key ? 1 : -1))
  }, [portals, context, insPointName])

  return { components }
}
