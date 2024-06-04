import React, { FC, useEffect, useState } from 'react'
import { useMutableWeb } from '../../../react'
import { IContextNode } from '../../../core'

const BORDER_RADIUS = 6 // px
const BORDER_COLOR = '#384BFF' //blue
const BORDER_STYLE = 'dashed'
const BORDER_WIDTH = 2 //px
const BACKGROUND_COLOR = 'rgb(56 188 255 / 5%)' // light blue

const styledBorder = `${BORDER_WIDTH}px ${BORDER_STYLE} ${BORDER_COLOR}`

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
  const [isDisplayed, setIsDisplayed] = useState(false)

  useEffect(() => {
    const mouseEnterHandler = () => {
      setIsEntered(true)
      setTimeout(() => setIsDisplayed(true))
    }
    const mouseLeaveHandler = () => {
      setIsEntered(false)
      setTimeout(() => setIsDisplayed(false))
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

  const wrapperStyle: React.CSSProperties = {
    left: targetOffset.left - bodyOffset.left,
    top: targetOffset.top - bodyOffset.top,
    width: targetWidth,
    height: targetHeight,
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: BORDER_RADIUS,
    border: styledBorder,
    position: 'absolute',
    zIndex: 99999999,
    pointerEvents: 'none',
    transition: 'all .2s ease-in-out',
    opacity: isDisplayed ? 1 : 0,
  }

  return <div style={wrapperStyle} className="mweb-picker" />
}
