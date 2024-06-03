import React, { FC, useEffect, useState } from 'react'
import { useMutableWeb } from '../../../react'
import { IContextNode } from '../../../core'

const BORDER_RADIUS = 6 // px
const BORDER_COLOR = '#384BFF' //blue
const BORDER_STYLE = 'dashed'
const BORDER_WIDTH = 2 //px

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
    transition: 'all .2s ease-in-out',
    opacity: isDisplayed ? 1 : 0,
  }

  const topStyle: React.CSSProperties = {
    left: targetOffset.left + 4 - bodyOffset.left,
    top: targetOffset.top - 1 - bodyOffset.top,
    width: targetWidth - BORDER_RADIUS,
    height: 2,
    position: 'absolute',
    zIndex: 9999999,
    borderTop: styledBorder,
  }

  const bottomStyle: React.CSSProperties = {
    left: targetOffset.left + 4 - bodyOffset.left,
    top: targetOffset.top + targetHeight - 1 - bodyOffset.top,
    width: targetWidth - BORDER_RADIUS,
    height: 2,
    position: 'absolute',
    zIndex: 9999999,
    borderBottom: styledBorder,
  }

  const leftStyle: React.CSSProperties = {
    left: targetOffset.left - 2 - bodyOffset.left,
    top: targetOffset.top - 1 - bodyOffset.top,
    height: targetHeight + 2,
    width: BORDER_RADIUS,
    position: 'absolute',
    zIndex: 9999999,
    borderLeft: styledBorder,
    borderTop: styledBorder,
    borderBottom: styledBorder,
    borderRadius: `${BORDER_RADIUS}px 0 0 ${BORDER_RADIUS}px`,
  }

  const rightStyle: React.CSSProperties = {
    left: targetOffset.left + targetWidth - 2 - bodyOffset.left,
    top: targetOffset.top - 1 - bodyOffset.top,
    height: targetHeight + 2,
    width: BORDER_RADIUS,
    position: 'absolute',
    zIndex: 9999999,
    borderRight: styledBorder,
    borderTop: styledBorder,
    borderBottom: styledBorder,
    borderRadius: `0 ${BORDER_RADIUS}px ${BORDER_RADIUS}px 0`,
  }

  return (
    <div style={wrapperStyle} className="mweb-picker">
      <div style={topStyle}></div>
      <div style={leftStyle}></div>
      <div style={rightStyle}></div>
      <div style={bottomStyle}></div>
    </div>
  )
}
