import React, { FC } from 'react'
import { useCore } from '../../../react'
import { IContextNode } from '../../../core'
import { useEngine } from '../contexts/engine-context'
import { MutationManager } from '../../mutation-manager'
import { ContextReactangle } from '../../../highlighter'

const ContextTraverser: FC<{
  node: IContextNode
  children: React.FC<{ node: IContextNode; contextDepth?: number }>
  contextDepth?: number
}> = ({ node, children: ChildrenComponent, contextDepth = 0 }) => {
  return (
    <>
      {node.element ? <ChildrenComponent node={node} contextDepth={contextDepth} /> : null}
      {node.children.map((child, i) => (
        <ContextTraverser
          key={i}
          node={child}
          children={ChildrenComponent}
          contextDepth={contextDepth + 1}
        />
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
      {({ node, contextDepth }) => {
        const isSuitable = pickerTask.target
          ? MutationManager._isTargetMet(pickerTask.target, node)
          : true

        if (!isSuitable) return null

        return (
          <ContextReactangle
            context={node}
            onClick={() => pickerTask.callback?.(node)}
            contextDepth={contextDepth}
          />
        )
      }}
    </ContextTraverser>
  )
}
