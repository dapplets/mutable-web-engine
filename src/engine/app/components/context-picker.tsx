import React, { FC } from 'react'
import { useCore } from '../../../react'
import { IContextNode } from '../../../core'
import { useEngine } from '../contexts/engine-context'
import { MutationManager } from '../../mutation-manager'
import { ContextReactangle } from '../../../highlighter'

const ContextTraverser: FC<{ node: IContextNode; children: React.FC<{ node: IContextNode }> }> = ({
  node,
  children: ChildrenComponent,
}) => {
  return (
    <>
      {node.element ? <ChildrenComponent node={node} /> : null}
      {node.children.map((child, i) => (
        <ContextTraverser key={i} node={child} children={ChildrenComponent} />
      ))}
    </>
  )
}

export const ContextPicker: FC = () => {
  const { tree } = useCore()
  const { pickerTask } = useEngine()

  if (!tree || !pickerTask) return null

  return (
    <ContextTraverser node={tree}>
      {({ node }) => {
        const isSuitable = pickerTask.target
          ? MutationManager._isTargetMet(pickerTask.target, node)
          : true

        if (!isSuitable) return null

        return <ContextReactangle context={node} onClick={() => pickerTask.callback?.(node)} />
      }}
    </ContextTraverser>
  )
}
