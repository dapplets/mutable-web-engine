import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ContextPortal } from '../../../react'
import { IContextNode, InsertionPointWithElement } from '../../../core'
import { useEngine } from '../contexts/engine-context'
import { useUserLinks } from '../contexts/mutable-web-context/use-user-links'
import { Widget } from 'near-social-vm'
import { usePortalFilter } from '../contexts/engine-context/use-portal-filter'
import { ShadowDomWrapper } from '../../bos/shadow-dom-wrapper'
import { ContextTree } from '../../../react/components/context-tree'
import { useContextApps } from '../contexts/mutable-web-context/use-context-apps'
import { Target } from '../services/target/target.entity'
import { AppId, AppMetadata } from '../services/application/application.entity'
import { BosUserLink, UserLinkId } from '../services/user-link/user-link.entity'
import { useModal } from '../contexts/modal-context'

export const ContextManager: FC = () => {
  return <ContextTree children={ContextHandler} />
}

const ContextHandler: FC<{ context: IContextNode; insPoints: InsertionPointWithElement[] }> = ({
  context,
  insPoints,
}) => {
  const { userLinks, createUserLink, deleteUserLink } = useUserLinks(context)
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

  const handleEnableEditMode = useCallback(() => {
    setIsEditMode(true)
  }, [setIsEditMode])

  const handleDisableEditMode = useCallback(() => {
    setIsEditMode(false)
  }, [setIsEditMode])

  return (
    <>
      {insPoints.map((ip) => (
        <ContextPortal key={ip.name} context={context} injectTo={ip.name}>
          <InsPointHandler
            insPointName={ip.name}
            bosLayoutManager={ip.bosLayoutManager}
            context={context}
            transferableContext={transferableContext}
            allUserLinks={userLinks}
            apps={apps}
            isEditMode={isEditMode}
            onCreateUserLink={createUserLink}
            onDeleteUserLink={deleteUserLink}
            onEnableEditMode={handleEnableEditMode}
            onDisableEditMode={handleDisableEditMode}
            onAttachContextRef={attachContextRef}
          />
        </ContextPortal>
      ))}
      {/* For OverlayTrigger */}
      <ContextPortal context={context}>
        <InsPointHandler
          context={context}
          transferableContext={transferableContext}
          allUserLinks={userLinks}
          apps={apps}
          isEditMode={isEditMode}
          onCreateUserLink={createUserLink}
          onDeleteUserLink={deleteUserLink}
          onEnableEditMode={handleEnableEditMode}
          onDisableEditMode={handleDisableEditMode}
          onAttachContextRef={attachContextRef}
        />
      </ContextPortal>
    </>
  )
}

const InsPointHandler: FC<{
  insPointName?: string
  bosLayoutManager?: string
  context: IContextNode
  transferableContext: TransferableContext
  allUserLinks: BosUserLink[]
  apps: AppMetadata[]
  isEditMode: boolean
  onCreateUserLink: (appId: AppId) => Promise<void>
  onDeleteUserLink: (userLinkId: UserLinkId) => Promise<void>
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
  onCreateUserLink,
  onDeleteUserLink,
  onEnableEditMode,
  onDisableEditMode,
  onAttachContextRef,
}) => {
  const { pickerTask, setPickerTask, redirectMap } = useEngine()
  const { components } = usePortalFilter(context, insPointName) // ToDo: extract to the separate AppManager component
  const { notify } = useModal()

  const pickContext = useCallback((target: Target) => {
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
    (target: Target, callback: (context: TransferableContext) => void) => {
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
      // ToDo: the similar logic is used in ContextPortal
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
        notify,
      }, // ToDo: add props
      isSuitable: link.insertionPoint === insPointName, // ToDo: LM know about widgets from other LM
    })),
    components: components,
    isEditMode: isEditMode,

    // ToDo: move functions to separate api namespace?
    createUserLink: onCreateUserLink,
    deleteUserLink: onDeleteUserLink,
    enableEditMode: onEnableEditMode,
    disableEditMode: onDisableEditMode,

    // For OverlayTrigger
    attachContextRef: onAttachContextRef,
    attachInsPointRef,

    pickContext,
    pickContexts,

    notify,
  }

  // Don't render layout manager if there are no components
  // It improves performance
  if (
    components.length === 0 &&
    !allUserLinks.some((link) => link.insertionPoint === insPointName) &&
    bosLayoutManager !== 'bos.dapplets.near/widget/ContextActionsGroup' // ToDo: hardcode
  ) {
    return null
  }

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
