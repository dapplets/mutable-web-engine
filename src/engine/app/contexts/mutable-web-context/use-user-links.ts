import { useCallback, useEffect, useState } from 'react'
import { IContextNode } from '../../../../core'
import { BosUserLink } from '../../services/user-link/user-link.entity'
import { useMutableWeb } from '.'

export const useUserLinks = (context: IContextNode) => {
  const { engine, selectedMutation, activeApps } = useMutableWeb()
  const [userLinks, setUserLinks] = useState<BosUserLink[]>([])
  const [error, setError] = useState<Error | null>(null)

  const fetchUserLinks = useCallback(async () => {
    if (!engine || !selectedMutation?.id) {
      setUserLinks([])
      return
    }

    try {
      const links = await engine.userLinkService.getLinksForContext(
        activeApps,
        selectedMutation.id,
        context
      )
      setUserLinks(links)
    } catch (err) {
      if (err instanceof Error) {
        setError(err)
      } else {
        setError(new Error('An unknown error occurred'))
      }
    }
  }, [engine, selectedMutation, activeApps, context])

  useEffect(() => {
    fetchUserLinks()
  }, [fetchUserLinks])

  return { userLinks, error }
}
