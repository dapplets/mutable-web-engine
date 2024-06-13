import React, { FC } from 'react'
import { ContextTree, useCore } from '../../../react'
import { useEngine } from '../contexts/engine-context'
import { MutationManager } from '../../mutation-manager'
import { ContextReactangle } from '../../../highlighter'

export const ContextPicker: FC = () => {
  const { tree } = useCore()
  const { pickerTask } = useEngine()

  if (!tree || !pickerTask) return null

  return (
    <ContextTree>
      {({ context }) => {
        const isSuitable = pickerTask.target
          ? MutationManager._isTargetMet(pickerTask.target, context)
          : true

        if (!isSuitable) return null

        return (
          <ContextReactangle context={context} onClick={() => pickerTask.callback?.(context)} />
        )
      }}
    </ContextTree>
  )
}
