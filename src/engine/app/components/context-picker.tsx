import React, { FC, useEffect, useRef, useState } from 'react'
import { useMutableWeb } from '../../../react'
import { IContextNode } from '../../../core'
import { useEngine } from '../contexts/engine-context'
import { MutationManager } from '../../mutation-manager'

const BORDER_RADIUS = 6 // px
const BORDER_COLOR = '#384BFF' //blue
const BORDER_STYLE = 'dashed'
const BORDER_WIDTH = 2 //px
const BACKGROUND_COLOR = 'rgb(56 188 255 / 5%)' // light blue

const styledBorder = `${BORDER_WIDTH}px ${BORDER_STYLE} ${BORDER_COLOR}`

export const ContextPicker: FC = () => {
  const { tree } = useMutableWeb()
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

const ContextReactangle: FC<{
  context: IContextNode
  onClick: () => void
}> = ({ context, onClick }) => {
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
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: BORDER_RADIUS,
    border: styledBorder,
    position: 'absolute',
    zIndex: 99999999,
    // pointerEvents: 'none',
    transition: 'all .2s ease-in-out',
    opacity: isEntered ? 1 : 0,
  }

  return (
    <div
      ref={pickerRef}
      style={wrapperStyle}
      className="mweb-picker"
      onClick={onClick} // ToDo: doesn't work beacuse of pointerEvents: 'none'
    />
  )
}
