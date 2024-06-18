import React, { FC, useEffect, useRef } from 'react'
import { IContextNode } from '../core'

const DEFAULT_BORDER_RADIUS = 6 // px
const DEFAULT_BORDER_COLOR = '#384BFF' // blue
const DEFAULT_INACTIVE_BORDER_COLOR = '#384BFF4D' // light blue
const DEFAULT_BORDER_STYLE = 'solid'
const DEFAULT_CHILDREN_BORDER_STYLE = 'dashed'
const DEFAULT_BORDER_WIDTH = 2 //px
const DEFAULT_BACKGROUND_COLOR = 'rgb(56 188 255 / 5%)' // light light blue

const getElementDepth = (el: Element | Node) => {
  let depth = 0
  let host = (el as any).host
  while (el.parentNode !== null || host) {
    if (host) el = host as Node
    el = el.parentNode!
    host = (el as any).host
    depth++
  }
  return depth
}

const getContextDepth = (context: IContextNode): number => {
  return context.element ? getElementDepth(context.element) : 0
}

interface IHighlighter {
  focusedContext: IContextNode | null
  context: IContextNode
  onMouseEnter: () => void
  onMouseLeave: () => void
  styles?: React.CSSProperties
  onClick?: (() => void) | null
  highlightChildren?: boolean
  variant?: 'primary' | 'secondary'
}

export const Highlighter: FC<IHighlighter> = ({
  focusedContext,
  context,
  onMouseEnter,
  onMouseLeave,
  styles,
  onClick,
  highlightChildren,
  variant,
}) => {
  const pickerRef = useRef<any>(null)

  useEffect(() => {
    if (!pickerRef.current) return
    pickerRef.current.addEventListener('mouseenter', onMouseEnter)
    pickerRef.current.addEventListener('mouseleave', onMouseLeave)

    return () => {
      if (!pickerRef.current) return
      pickerRef.current.removeEventListener('mouseenter', onMouseEnter)
      pickerRef.current.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [pickerRef.current])

  if (!context.element) return null

  const isFirstLevelContext = !context.parentNode || context.parentNode.contextType === 'root'

  const bodyOffset = document.documentElement.getBoundingClientRect()
  const targetOffset = context.element.getBoundingClientRect()
  const contextDepth = getContextDepth(context)
  const backgroundColor = onClick
    ? styles?.backgroundColor ?? DEFAULT_BACKGROUND_COLOR
    : 'transparent'
  const opacity =
    variant === 'primary' ||
    (variant === 'secondary' && highlightChildren) ||
    (!focusedContext && isFirstLevelContext)
      ? 1
      : 0
  const border =
    styles?.border ??
    `${DEFAULT_BORDER_WIDTH}px ${isFirstLevelContext ? DEFAULT_BORDER_STYLE : DEFAULT_CHILDREN_BORDER_STYLE} ${focusedContext ? DEFAULT_BORDER_COLOR : DEFAULT_INACTIVE_BORDER_COLOR}`

  const wrapperStyle: React.CSSProperties = {
    position: 'absolute',
    top: targetOffset.top - bodyOffset.top,
    left: targetOffset.left - bodyOffset.left,
    width: targetOffset.width,
    height: targetOffset.height,
    borderRadius: styles?.borderRadius ?? DEFAULT_BORDER_RADIUS,
    border,
    backgroundColor,
    transition: 'all .2s ease-in-out',
    cursor: 'pointer',
    pointerEvents: onClick ? 'auto' : 'none',
    zIndex: 1000000 + (contextDepth ?? 0),
    opacity,
  }

  return (
    <div
      ref={pickerRef}
      style={wrapperStyle}
      className="mweb-picker"
      onClick={onClick ?? undefined}
    />
  )
}
