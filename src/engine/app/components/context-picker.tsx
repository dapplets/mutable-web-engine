import React, { FC, useCallback, useMemo, useState } from 'react'
import { ContextTree, useCore } from '../../../react'
import { useEngine } from '../contexts/engine-context'
import { Highlighter } from '../../../highlighter'
import { TargetService } from '../services/target/target.service'
import { IContextNode } from '../../../core'

export const ContextPicker: FC = () => {
  const { tree } = useCore()
  const { pickerTask } = useEngine()

  const [focusedContext, setFocusedContext] = useState<IContextNode | null>(null)

  if (!tree || !pickerTask) return null

  return (
    <ContextTree>
      {({ context }) => {
        const isSuitable = pickerTask?.target
          ? Array.isArray(pickerTask.target)
            ? pickerTask.target.map((t) => TargetService.isTargetMet(t, context)).includes(true)
            : TargetService.isTargetMet(pickerTask.target, context)
          : true

        if (!isSuitable) return null

        const variant = useMemo(() => {
          if (focusedContext === context) return 'primary'
          if (focusedContext === context.parentNode) return 'secondary'
        }, [focusedContext, context])

        const handleClick = useCallback(() => {
          pickerTask.onClick?.(context)
        }, [pickerTask, context])

        const handleMouseEnter = useCallback(() => {
          setFocusedContext(context)
          pickerTask.onMouseEnter?.(context)
        }, [context])

        const handleMouseLeave = useCallback(() => {
          setFocusedContext(null)
          pickerTask.onMouseLeave?.(context)
        }, [context])

        return (
          <Highlighter
            focusedContext={focusedContext}
            context={context}
            variant={variant}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            styles={pickerTask.styles}
            highlightChildren={pickerTask.highlightChildren}
            LatchComponent={pickerTask.LatchComponent}
          />
        )
      }}
    </ContextTree>
  )
}
