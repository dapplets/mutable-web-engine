import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { MWebPortal } from '../../../react'
import { IContextNode } from '../../../core'
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

const ContextHandler: FC<{ context: IContextNode }> = ({ context }) => {
  const { userLinks: allUserLinks } = useUserLinks(context)
  const { apps } = useContextApps(context)

  const [isEditMode, setIsEditMode] = useState(false)

  const transferableContext = useMemo(() => buildTransferableContext(context), [context])

  return context.insPoints.map((ip) => {
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
}) => {
  const { pickerTask, setPickerTask, redirectMap } = useEngine()
  const { components } = usePortals(context, insPointName)

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
    // attachContextRef: this._attachContextRef.bind(this),
    // attachInsPointRef: this._attachInsPointRef.bind(this),

    pickContext,
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
