import React, { FC, ReactElement, useCallback, useRef } from 'react'
import { ModalContext, ModalContextState, ModalProps, NotificationType } from './modal-context'
import { Button, Space, notification } from 'antd'
import { useViewport } from '../viewport-context'

type Props = {
  children?: ReactElement
}

const ModalProvider: FC<Props> = ({ children }) => {
  const { viewportRef } = useViewport()
  const counterRef = useRef(0)
  const [api, contextHolder] = notification.useNotification({
    getContainer: () => {
      if (!viewportRef.current) throw new Error('Viewport is not initialized')
      return viewportRef.current
    },
  })

  const notify = useCallback(
    (modalProps: ModalProps) => {
      if (!Object.values(NotificationType).includes(modalProps.type)) {
        console.error('Unknown notification type: ' + modalProps.type)
        return
      }

      const modalId = counterRef.current++

      api[modalProps.type]({
        key: modalId,
        message: modalProps.subject,
        description: modalProps.body,
        placement: 'bottomRight',
        duration: null,
        btn:
          modalProps.actions && modalProps.actions.length
            ? modalProps.actions.map((action, i) => (
                <Space key={i} style={{ marginRight: '10px', marginBottom: '10px' }}>
                  <Button
                    type={action.type ?? 'primary'}
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
