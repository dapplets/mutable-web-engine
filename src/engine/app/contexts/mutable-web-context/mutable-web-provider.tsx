import React, { FC, ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MutableWebContext, MutableWebContextState } from './mutable-web-context'
import { Engine, EngineConfig } from '../../../engine'
import { useMutationApps } from './use-mutation-apps'
import { useMutationParsers } from './use-mutation-parsers'
import { useCore } from '../../../../react'
import { useMutations } from './use-mutations'
import { useApplications } from './use-applications'
import { TargetService } from '../../services/target/target.service'
import { AdapterType, ParserConfig } from '../../services/parser-config/parser-config.entity'

type Props = {
  config: EngineConfig
  defaultMutationId?: string | null
  children: ReactElement
}

const MWebParserConfig: ParserConfig = {
  parserType: AdapterType.MWeb,
  id: 'mweb',
  targets: [
    {
      namespace: 'engine',
      contextType: 'website',
      if: { id: { not: null } },
    },
  ],
}

const MutableWebProvider: FC<Props> = ({ config, defaultMutationId, children }) => {
  const { tree, attachParserConfig, updateRootContext } = useCore()
  const engineRef = useRef<Engine | null>(null)

  if (!engineRef.current) {
    engineRef.current = new Engine(config)
    attachParserConfig(MWebParserConfig) // ToDo: move
  }

  const engine = engineRef.current

  const { mutations, setMutations, isLoading: isMutationsLoading } = useMutations(engine)
  const { applications: allApps, isLoading: isAppsLoading } = useApplications(engine)

  const [selectedMutationId, setSelectedMutationId] = useState<string | null>(null)
  const [favoriteMutationId, setFavoriteMutationId] = useState<string | null>(null)

  useEffect(() => {
    engine.mutationService.getFavoriteMutation().then((mutationId) => {
      setFavoriteMutationId(mutationId)
    })
  }, [engine])

  const getMutationToBeLoaded = useCallback(async () => {
    return (
      defaultMutationId ??
      (await engine.mutationService.getFavoriteMutation()) ??
      (tree ? await engine.mutationService.getLastUsedMutation(tree) : null)
    )
  }, [defaultMutationId, engine, tree])

  useEffect(() => {
    getMutationToBeLoaded().then((mutationId) => {
      setSelectedMutationId(mutationId)
    })
  }, [getMutationToBeLoaded])

  const selectedMutation = useMemo(
    () => mutations.find((mut) => mut.id === selectedMutationId) ?? null,
    [mutations, selectedMutationId]
  )

  const {
    mutationApps,
    setMutationApps,
    isLoading: isMutationAppsLoading,
  } = useMutationApps(engine, selectedMutation)

  const activeApps = useMemo(
    () => mutationApps.filter((app) => app.settings.isEnabled),
    [mutationApps]
  )

  const { parserConfigs, isLoading: isMutationParsersLoading } = useMutationParsers(
    engine,
    mutationApps
  )

  useEffect(() => {
    if (!tree) return

    updateRootContext({
      mutationId: selectedMutationId ?? null,
      gatewayId: config.gatewayId,
    })

    // Load parser configs for root context
    // ToDo: generalize for whole context tree
    for (const parser of parserConfigs) {
      const isSuitableParser = parser.targets.some((target) =>
        TargetService.isTargetMet(target, tree)
      )

      if (isSuitableParser) {
        attachParserConfig(parser)
      }
    }
  }, [parserConfigs, tree, selectedMutationId])

  // ToDo: move to separate hook
  const switchMutation = useCallback(
    async (mutationId: string | null) => {
      if (selectedMutationId === mutationId) return

      setSelectedMutationId(mutationId)

      if (mutationId) {
        await engine.mutationService.updateMutationLastUsage(mutationId, window.location.hostname)
      }
    },
    [selectedMutationId]
  )

  // ToDo: move to separate hook
  const setFavoriteMutation = useCallback(
    async (mutationId: string | null) => {
      try {
        setFavoriteMutationId(mutationId)

        await engine.mutationService.setFavoriteMutation(mutationId)

        setMutations((prev) =>
          prev.map((mut) =>
            mut.id === mutationId
              ? { ...mut, settings: { ...mut.settings, isFavorite: true } }
              : { ...mut, settings: { ...mut.settings, isFavorite: false } }
          )
        )
      } catch (err) {
        console.error(err)
      }
    },
    [engine]
  )

  // ToDo: move to separate hook
  const removeMutationFromRecents = useCallback(
    async (mutationId: string) => {
      try {
        await engine.mutationService.removeMutationFromRecents(mutationId)

        setMutations((prev) =>
          prev.map((mut) =>
            mut.id === mutationId ? { ...mut, settings: { ...mut.settings, lastUsage: null } } : mut
          )
        )
      } catch (err) {
        console.error(err)
      }
    },
    [engine]
  )

  const isLoading =
    isMutationsLoading || isAppsLoading || isMutationAppsLoading || isMutationParsersLoading

  const state: MutableWebContextState = {
    engine,
    mutations,
    allApps,
    mutationApps,
    activeApps,
    selectedMutation,
    isLoading,
    switchMutation,
    setFavoriteMutation,
    removeMutationFromRecents,
    favoriteMutationId,
    setMutations,
    setMutationApps,
  }

  return <MutableWebContext.Provider value={state}>{children}</MutableWebContext.Provider>
}

export { MutableWebProvider }
