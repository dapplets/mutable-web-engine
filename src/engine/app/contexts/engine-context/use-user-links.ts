import { useCallback, useEffect, useState } from 'react'
import { useEngine } from './use-engine'
import { IContextNode } from '../../../../core'
import { BosUserLink } from '../../../providers/provider'

export const useUserLinks = (context: IContextNode) => {
  const { engine } = useEngine()
  const [userLinks, setUserLinks] = useState<BosUserLink[]>([])
  const [error, setError] = useState<Error | null>(null)

  const fetchUserLinks = useCallback(async () => {
    if (!engine || !engine.mutation?.id) return

    try {
      const links = await engine.getLinksForContext(engine.mutation?.id, context)
      setUserLinks(links)
    } catch (err) {
      if (err instanceof Error) {
        setError(err)
      } else {
        setError(new Error('An unknown error occurred'))
      }
    }
  }, [engine, context])

  useEffect(() => {
    fetchUserLinks()
  }, [fetchUserLinks])

  return { userLinks, error }
}
