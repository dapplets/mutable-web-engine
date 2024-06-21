import React, { FC, ReactElement, useCallback } from 'react'
import { ModalContext, ModalContextState, ModalProps } from './modal-context'
import { notification } from 'antd'

type Props = {
  children?: ReactElement
}

const ModalProvider: FC<Props> = ({ children }) => {
  const [api, contextHolder] = notification.useNotification()

  const notify = useCallback((modalProps: ModalProps) => {
    api.info({
      message: modalProps.subject,
      description: modalProps.body,
      placement: 'bottomRight',
      
    })
  }, [])

  const state: ModalContextState = {
    notify,
  }

  return (
    <ModalContext.Provider value={state}>
      <>{contextHolder}</>
      <>{children}</>
    </ModalContext.Provider>
  )
}

export { ModalProvider }
