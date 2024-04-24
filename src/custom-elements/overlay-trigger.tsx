import * as React from 'react'
import { OverlayTrigger as RbOverlayTrigger } from 'react-bootstrap'
import { getViewport } from '../common'

// ToDo: remove any
export const OverlayTrigger = ({ children, ...attributes }: any) => {
  const child = children.filter((c: any) => typeof c !== 'string' || !!c.trim())[0]

  return (
    <RbOverlayTrigger {...attributes} container={getViewport()}>
      {child}
    </RbOverlayTrigger>
  )
}
