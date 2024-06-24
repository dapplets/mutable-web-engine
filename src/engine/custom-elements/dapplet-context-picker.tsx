import * as React from 'react'
import { useEngine } from '../app/contexts/engine-context'
import { Target } from '../app/services/target/target.entity'
import { TransferableContext, buildTransferableContext } from '../app/common/transferable-context'
import { TLatchVariant } from '../app/contexts/engine-context/engine-context'

const _DappletContextPicker: React.FC<{
  target?: Target | Target[]
  onClick?: (ctx: TransferableContext) => void
  onMouseEnter?: (ctx: TransferableContext) => void
  onMouseLeave?: (ctx: TransferableContext) => void
  LatchComponent?: React.FC<{
    context: TransferableContext
    variant: TLatchVariant
    contextDimensions: { width: number; height: number }
  }>
  highlightChildren?: boolean // ToDo: remove
}> = ({ target, onClick, onMouseEnter, onMouseLeave, LatchComponent, highlightChildren }) => {
  const { setPickerTask } = useEngine()

  React.useEffect(() => {
    setPickerTask({
      target,
      onClick: (ctx) => onClick?.(buildTransferableContext(ctx)),
      onMouseEnter: (ctx) => onMouseEnter?.(buildTransferableContext(ctx)),
      onMouseLeave: (ctx) => onMouseLeave?.(buildTransferableContext(ctx)),
      LatchComponent: LatchComponent
        ? ({ context, variant, contextDimensions }) => (
            <LatchComponent
              context={buildTransferableContext(context)}
              variant={variant}
              contextDimensions={contextDimensions}
            />
          )
        : undefined,
      highlightChildren,
    })
    return () => setPickerTask(null)
  }, [target, onClick, onMouseEnter, onMouseLeave, LatchComponent, highlightChildren])

  return null
}

export const DappletContextPicker: React.FC<any> = (props) => {
  return <_DappletContextPicker {...props} />
}
