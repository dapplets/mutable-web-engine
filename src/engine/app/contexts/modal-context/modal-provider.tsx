import React, { FC, ReactElement, useCallback } from 'react'
import { ModalContext, ModalContextState, ModalProps, NotificationType } from './modal-context'
import { Button, Space, notification } from 'antd'

type Props = {
  children?: ReactElement
}

const ModalProvider: FC<Props> = ({ children }) => {
  const [api, contextHolder] = notification.useNotification()
  const validTypes = Object.values(NotificationType)

  const notify = useCallback((modalProps: ModalProps) => {
    if (!validTypes.includes(modalProps.type)) {
      return
    }

    api[modalProps.type]({
      message: modalProps.subject,
      description: modalProps.body,
      placement: 'bottomRight',
      key: modalProps.id,

      btn:
        modalProps.actions && modalProps.actions.length
          ? modalProps.actions.map((x, i) => (
              <Space key={i} style={{ marginRight: '10px' }}>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    x.onClick()
                    api.destroy(modalProps.id)
                  }}
                >
                  {x.label}
                </Button>
              </Space>
            ))
          : null,
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
