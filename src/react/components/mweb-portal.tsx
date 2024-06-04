import { FC, ReactElement } from 'react'
import { createPortal } from 'react-dom'
import { IContextNode } from '../../core'

export const MWebPortal: FC<{
  context: IContextNode
  children: ReactElement
  injectTo?: string
}> = ({ context, children, injectTo }) => {

  // ToDo: replace insPoints.find with Map
  const targetElement = injectTo
    ? context.insPoints.find((ip) => ip.name === injectTo)?.element
    : context.element

  if (!targetElement) return null

  return createPortal(children, targetElement)
}
