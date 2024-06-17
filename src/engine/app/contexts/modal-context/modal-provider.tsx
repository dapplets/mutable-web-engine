import React, { FC, ReactElement, useCallback, useState } from 'react'
import { ModalContext, ModalContextState, ModalProps } from './modal-context'

type Props = {
  children?: ReactElement
}

const ModalProvider: FC<Props> = ({ children }) => {
  const [modals, setModals] = useState<ModalProps[]>([]) // ToDo: add id

  const notify = useCallback((modalProps: ModalProps) => {
    setModals((prev) => [...prev, modalProps])
  }, [])

  const closeModal = useCallback((subject: string) => {
    setModals((prev) => prev.filter((modal) => modal.subject !== subject))
  }, [])

  const state: ModalContextState = {
    modals,
    notify,
    closeModal,
  }

  return <ModalContext.Provider value={state}>{children}</ModalContext.Provider>
}

export { ModalProvider }
