import React, { FC, useEffect, useState } from 'react'
import { useMutableWeb } from '../../../react'
import { IContextNode } from '../../../core'

export const ContextPicker: FC = () => {
  const { tree } = useMutableWeb()

  if (!tree) return null

  return <ContextTraverser node={tree} />
}

const ContextTraverser: FC<{ node: IContextNode }> = ({ node }) => {
  return (
    <>
      {node.element ? <ContextReactangle context={node} target={node.element} /> : null}
      {node.children.map((child, i) => (
        <ContextTraverser key={i} node={child} />
      ))}
    </>
  )
}

const ContextReactangle: FC<{ context: IContextNode; target: HTMLElement }> = ({
  context,
  target,
}) => {
  const [isEntered, setIsEntered] = useState(false)

  useEffect(() => {
    const mouseEnterHandler = () => {
      setIsEntered(true)
    }
    const mouseLeaveHandler = () => {
      setIsEntered(false)
    }
    target.addEventListener('mouseenter', mouseEnterHandler)
    target.addEventListener('mouseleave', mouseLeaveHandler)

    return () => {
      target.removeEventListener('mouseenter', mouseEnterHandler)
      target.removeEventListener('mouseleave', mouseLeaveHandler)
    }
  }, [target])

  if (!isEntered) return null

  const bodyOffset = document.documentElement.getBoundingClientRect()
  const targetOffset = target.getBoundingClientRect()
  const targetHeight = targetOffset.height
  const targetWidth = targetOffset.width

  const topStyle: React.CSSProperties = {
    left: targetOffset.left - 4 - bodyOffset.left,
    top: targetOffset.top - 4 - bodyOffset.top,
    width: targetWidth + 5,
    background: 'blue',
    height: 3,
    position: 'absolute',
    transition: 'all 300ms ease',
  }

  const bottomStyle: React.CSSProperties = {
    top: targetOffset.top + targetHeight + 1 - bodyOffset.top,
    left: targetOffset.left - 3 - bodyOffset.left,
    width: targetWidth + 4,
    background: 'blue',
    height: 3,
    position: 'absolute',
    transition: 'all 300ms ease',
  }

  const leftStyle: React.CSSProperties = {
    left: targetOffset.left - 5 - bodyOffset.left,
    top: targetOffset.top - 4 - bodyOffset.top,
    height: targetHeight + 8,
    background: 'blue',
    width: 3,
    position: 'absolute',
    transition: 'all 300ms ease',
  }

  const rightStyle: React.CSSProperties = {
    left: targetOffset.left + targetWidth + 1 - bodyOffset.left,
    top: targetOffset.top - 4 - bodyOffset.top,
    height: targetHeight + 8,
    background: 'blue',
    width: 3,
    position: 'absolute',
    transition: 'all 300ms ease',
  }

  return (
    <div>
      <div style={topStyle}></div>
      <div style={leftStyle}></div>
      <div style={rightStyle}></div>
      <div style={bottomStyle}></div>
    </div>
  )
}
