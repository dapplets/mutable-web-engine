import React, { FC, useEffect, useRef, useState } from 'react'
import { IContextNode } from '../core'

const DEFAULT_BORDER_RADIUS = 6 // px
const DEFAULT_BORDER_COLOR = '#384BFF' //blue
const DEFAULT_BORDER_STYLE = 'dashed'
const DEFAULT_BORDER_WIDTH = 2 //px
const DEFAULT_BACKGROUND_COLOR = 'rgb(56 188 255 / 5%)' // light blue

const defaultStyledBorder = `${DEFAULT_BORDER_WIDTH}px ${DEFAULT_BORDER_STYLE} ${DEFAULT_BORDER_COLOR}`

interface IContextReactangle {
  context: IContextNode
  styles?: React.CSSProperties
  onClick?: () => void
}

export const ContextReactangle: FC<IContextReactangle> = ({ context, styles, onClick }) => {
  const [isEntered, setIsEntered] = useState(false)
  // const [isDisplayed, setIsDisplayed] = useState(false)
  const pickerRef = useRef<any>(null)

  useEffect(() => {
    if (!pickerRef.current) return

    const mouseEnterHandler = () => {
      setIsEntered(true)
      // setTimeout(() => setIsDisplayed(true))
    }
    const mouseLeaveHandler = () => {
      setIsEntered(false)
      // setTimeout(() => setIsDisplayed(false))
    }
    pickerRef.current.addEventListener('mouseenter', mouseEnterHandler)
    pickerRef.current.addEventListener('mouseleave', mouseLeaveHandler)

    return () => {
      if (!pickerRef.current) return

      pickerRef.current.removeEventListener('mouseenter', mouseEnterHandler)
      pickerRef.current.removeEventListener('mouseleave', mouseLeaveHandler)
    }
  }, [pickerRef.current])

  // if (!isEntered) return null
  if (!context.element) return null

  const bodyOffset = document.documentElement.getBoundingClientRect()
  const targetOffset = context.element.getBoundingClientRect()
  const targetHeight = targetOffset.height
  const targetWidth = targetOffset.width

  const wrapperStyle: React.CSSProperties = {
    left: targetOffset.left - bodyOffset.left,
    top: targetOffset.top - bodyOffset.top,
    width: targetWidth,
    height: targetHeight,
    backgroundColor: onClick ? styles?.backgroundColor ?? DEFAULT_BACKGROUND_COLOR : 'transparent',
    borderRadius: styles?.borderRadius ?? DEFAULT_BORDER_RADIUS,
    border: styles?.border ?? defaultStyledBorder,
    position: 'absolute',
    zIndex: 99999999,
    pointerEvents: onClick ? 'auto' : 'none',
    transition: 'all .2s ease-in-out',
    opacity: isEntered ? 1 : 0,
  }

  return <div ref={pickerRef} style={wrapperStyle} className="mweb-picker" onClick={onClick} />
}
