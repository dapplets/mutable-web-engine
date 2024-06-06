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
  const [wrappedNode, setWrappedNode] = useState({ node })
  const [children, setChildren] = useState([...node.children])

  useEffect(() => {
    const subscriptions = [
      node.on('childContextAdded', ({ child }) => {
        setChildren((prev) => [...prev, child])
      }),
      node.on('childContextRemoved', ({ child }) => {
        setChildren((prev) => prev.filter((c) => c !== child))
      }),
      node.on('contextChanged', () => {
        setWrappedNode({ node })
      }),
    ]

    // ToDo: subscribe to new insertion points

    return () => {
      subscriptions.forEach((sub) => sub.remove())
    }
  }, [node])

  return (
    <>
      {wrappedNode.node.element ? <Component context={wrappedNode.node} /> : null}
      {children.map((child) => (
        <TreeItem key={`${child.namespace}/${child.id}`} node={child} component={Component} />
      ))}
    </>
  )
}
