import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MWebPortal } from '../../../react'
import { IContextNode, InsertionPointWithElement } from '../../../core'
import { useEngine } from '../contexts/engine-context'
import { useUserLinks } from '../contexts/engine-context/use-user-links'
import { Widget } from 'near-social-vm'
import { AppMetadata, BosUserLink, ContextTarget } from '../../providers/provider'
import { usePortals } from '../contexts/engine-context/use-portals'
import { ShadowDomWrapper } from '../../bos/shadow-dom-wrapper'
import { ContextTree } from '../../../react/components/context-tree'
import { useContextApps } from '../contexts/engine-context/use-context-apps'

export const ContextManager: FC = () => {
  return <ContextTree children={ContextHandler} />
}

const ContextHandler: FC<{ context: IContextNode; insPoints: InsertionPointWithElement[] }> = ({
  context,
  insPoints,
}) => {
  const { userLinks: allUserLinks } = useUserLinks(context)
  const { apps } = useContextApps(context)

  const [isEditMode, setIsEditMode] = useState(false)

  const transferableContext = useMemo(() => buildTransferableContext(context), [context])

  // For OverlayTrigger
  const attachContextRef = useCallback(
    (callback: (r: React.Component | Element | null | undefined) => void) => {
      callback(context.element)
    },
    [context]
  )

  return insPoints.map((ip) => {
    return (
      <MWebPortal key={ip.name} context={context} injectTo={ip.name}>
        <InsPointHandler
          insPointName={ip.name}
          bosLayoutManager={ip.bosLayoutManager}
          context={context}
          transferableContext={transferableContext}
          allUserLinks={allUserLinks}
          apps={apps}
          isEditMode={isEditMode}
          onEnableEditMode={() => setIsEditMode(true)}
          onDisableEditMode={() => setIsEditMode(false)}
          onAttachContextRef={attachContextRef}
        />
      </MWebPortal>
    )
  })
}

const InsPointHandler: FC<{
  insPointName: string
  bosLayoutManager?: string
  context: IContextNode
  transferableContext: TransferableContext
  allUserLinks: BosUserLink[]
  apps: AppMetadata[]
  isEditMode: boolean
  onEnableEditMode: () => void
  onDisableEditMode: () => void
  onAttachContextRef: (callback: (r: React.Component | Element | null | undefined) => void) => void
}> = ({
  insPointName,
  bosLayoutManager,
  context,
  transferableContext,
  allUserLinks,
  apps,
  isEditMode,
  onEnableEditMode,
  onDisableEditMode,
  onAttachContextRef,
}) => {
  const { pickerTask, setPickerTask, redirectMap } = useEngine()
  const { components } = usePortals(context, insPointName) // ToDo: extract to the separate AppManager component

  const pickContext = useCallback((target: ContextTarget) => {
    return new Promise<TransferableContext | null>((resolve, reject) => {
      if (pickerTask) {
        return reject('The picker is busy')
      }

      const callback = (context: IContextNode | null) => {
        resolve(context ? buildTransferableContext(context) : null)
        setPickerTask(null)
      }

      setPickerTask({ callback, target })
    })
  }, [])

  const pickContexts = useCallback(
    (target: ContextTarget, callback: (context: TransferableContext) => void) => {
      if (pickerTask) {
        throw new Error('The picker is busy')
      }

      const stop = () => setPickerTask(null)

      const taskCallback = (context: IContextNode | null) => {
        if (context) {
          callback(buildTransferableContext(context))
        }
      }

      setPickerTask({ callback: taskCallback, target })

      return { stop }
    },
    []
  )

  const attachInsPointRef = useCallback(
    (callback: (r: React.Component | Element | null | undefined) => void) => {
      // ToDo: the similar logic is used in MWebPortal
      const targetElement = insPointName
        ? context.insPoints.find((ip) => ip.name === insPointName)?.element
        : context.element

      callback(targetElement)
    },
    [context, insPointName]
  )

  const defaultLayoutManager = 'bos.dapplets.near/widget/DefaultLayoutManager'
  const props = {
    // ToDo: unify context forwarding
    context: transferableContext,
    apps: apps.map((app) => ({
      id: app.id,
      metadata: app.metadata,
    })),
    widgets: allUserLinks.map((link) => ({
      linkId: link.id,
      linkAuthorId: link.authorId,
      src: link.bosWidgetId,
      props: {
        context: transferableContext,
        link: {
          id: link.id,
          authorId: link.authorId,
        },
      }, // ToDo: add props
      isSuitable: link.insertionPoint === insPointName, // ToDo: LM know about widgets from other LM
    })),
    components: components,
    isEditMode: isEditMode,

    // ToDo: move functions to separate api namespace?
    // createUserLink: this._createUserLink.bind(this),
    // deleteUserLink: this._deleteUserLink.bind(this),
    enableEditMode: onEnableEditMode,
    disableEditMode: onDisableEditMode,

    // For OverlayTrigger
    attachContextRef: onAttachContextRef,
    attachInsPointRef,

    pickContext,
    pickContexts,
  }

  // Don't render layout manager if there are no components
  // It improves performance
  // if (
  //   components.length === 0 &&
  //   !allUserLinks.some((link) => link.insertionPoint === insPointName)
  // ) {
  //   return null
  // }

  return (
    <ShadowDomWrapper>
      <Widget
        src={bosLayoutManager ?? defaultLayoutManager}
        props={props}
        loading={<></>}
        config={{ redirectMap }}
      />
    </ShadowDomWrapper>
  )
}

interface TransferableContext {
  namespace: string | null
  type: string
  id: string | null
  parsed: any
  parent: TransferableContext | null
}

const buildTransferableContext = (context: IContextNode): TransferableContext => ({
  namespace: context.namespace,
  type: context.contextType,
  id: context.id,
  parsed: context.parsedContext,
  parent: context.parentNode ? buildTransferableContext(context.parentNode) : null,
})
