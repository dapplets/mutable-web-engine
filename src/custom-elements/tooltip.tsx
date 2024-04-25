import React from 'react'
import { Tooltip as RbTooltip } from 'react-bootstrap'

export const Tooltip = React.forwardRef(({ children, ...attributes }: any, ref) => (
  <RbTooltip {...attributes} ref={ref}>{children}</RbTooltip>
))
