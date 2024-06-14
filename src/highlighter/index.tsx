import React, { FC, useEffect, useRef, useState } from 'react'
import { IContextNode } from '../core'

const DEFAULT_BORDER_RADIUS = 6 // px
const DEFAULT_BORDER_COLOR = '#384BFF' //blue
const DEFAULT_BORDER_STYLE = 'dashed'
const DEFAULT_BORDER_WIDTH = 2 //px
const DEFAULT_BACKGROUND_COLOR = 'rgb(56 188 255 / 5%)' // light blue

const defaultStyledBorder = `${DEFAULT_BORDER_WIDTH}px ${DEFAULT_BORDER_STYLE} ${DEFAULT_BORDER_COLOR}`

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

interface IContextReactangle {
  context: IContextNode
  styles?: React.CSSProperties
  onClick?: () => void
}

export const ContextReactangle: FC<IContextReactangle> = ({ context, styles, onClick }) => {
  const [isEntered, setIsEntered] = useState(false)
  const pickerRef = useRef<any>(null)

  useEffect(() => {
    if (!pickerRef.current) return

    const mouseEnterHandler = () => {
      setIsEntered(true)
    }
    const mouseLeaveHandler = () => {
      setIsEntered(false)
    }
    pickerRef.current.addEventListener('mouseenter', mouseEnterHandler)
    pickerRef.current.addEventListener('mouseleave', mouseLeaveHandler)

    return () => {
      if (!pickerRef.current) return

      pickerRef.current.removeEventListener('mouseenter', mouseEnterHandler)
      pickerRef.current.removeEventListener('mouseleave', mouseLeaveHandler)
    }
  }, [pickerRef.current])

  if (!context.element) return null

  const bodyOffset = document.documentElement.getBoundingClientRect()
  const targetOffset = context.element.getBoundingClientRect()
  const targetHeight = targetOffset.height
  const targetWidth = targetOffset.width
  const contextDepth = getContextDepth(context)

  const wrapperStyle: React.CSSProperties = {
    left: targetOffset.left - bodyOffset.left,
    top: targetOffset.top - bodyOffset.top,
    width: targetWidth,
    height: targetHeight,
    backgroundColor: onClick ? styles?.backgroundColor ?? DEFAULT_BACKGROUND_COLOR : 'transparent',
    borderRadius: styles?.borderRadius ?? DEFAULT_BORDER_RADIUS,
    border: styles?.border ?? defaultStyledBorder,
    position: 'absolute',
    zIndex: 1 + (contextDepth ?? 0),
    pointerEvents: onClick ? 'auto' : 'none',
    transition: 'all .2s ease-in-out',
    opacity: isEntered ? 1 : 0,
    cursor: 'pointer',
  }

  return <div ref={pickerRef} style={wrapperStyle} className="mweb-picker" onClick={onClick} />
}
