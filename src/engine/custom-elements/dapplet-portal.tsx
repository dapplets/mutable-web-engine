import * as React from 'react'
import { InjectableTarget } from '../providers/provider'
import { useEngine } from '../app/contexts/engine-context'

const _DappletPortal: React.FC<{ component: React.FC; target: InjectableTarget }> = ({
  component: Component,
  target,
}) => {
  const { addPortal, removePortal } = useEngine()

  // ToDo: remove singleton
  React.useEffect(() => {
    addPortal(target, Component)
    return () => removePortal(Component)
  }, [target, Component])

  return null
}

export const DappletPortal: React.FC<any> = (props) => {
  return <_DappletPortal {...props} />
}
