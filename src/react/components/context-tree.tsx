import { FC, useEffect, useState } from 'react'
import { IContextNode } from '../../core'
import React from 'react'
import { useMutableWeb } from '../contexts/mutable-web-context'

export const ContextTree: FC<{ children: React.FC<{ context: IContextNode }> }> = ({
  children,
}) => {
  const { tree } = useMutableWeb()

  if (!tree) return null

  return <TreeItem node={tree} component={children} />
}

const TreeItem: FC<{
  node: IContextNode
  component: React.FC<{ context: IContextNode }>
}> = ({ node, component: Component }) => {
  return (
    <>
      {node.element ? <Component context={node} /> : null}
      {node.children.map((child, i) => (
        <TreeItem key={child.id ?? i} node={child} component={Component} />
      ))}
    </>
  )
}
