import React, { FC, ReactElement, useCallback, useRef } from 'react'
import { ModalContext, ModalContextState, ModalProps, NotificationType } from './modal-context'
import { Button, Space, notification } from 'antd'

type Props = {
  children?: ReactElement
}

const ModalProvider: FC<Props> = ({ children }) => {
  const counterRef = useRef(0)
  const [api, contextHolder] = notification.useNotification()

  const notify = useCallback(
    (modalProps: ModalProps) => {
      if (!Object.values(NotificationType).includes(modalProps.type)) {
        console.error('Unknown notification type: ' + modalProps.type)
        return
      }

      const modalId = counterRef.current++

      console.log(modalProps)

      api[modalProps.type]({
        key: modalId,
        message: modalProps.subject,
        description: modalProps.body,
        placement: 'bottomRight',
        btn:
          modalProps.actions && modalProps.actions.length
            ? modalProps.actions.map((action, i) => (
                <Space key={i} style={{ marginRight: '10px' }}>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => {
                      action.onClick?.()
                      api.destroy(modalId)
                    }}
                  >
                    {action.label}
                  </Button>
                </Space>
              ))
            : null,
      })
    },
    [api]
  )

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
