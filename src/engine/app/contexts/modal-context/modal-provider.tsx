import React, { FC, ReactElement, useCallback, useRef, useState } from 'react'
import { ModalContext, ModalContextState, ModalProps } from './modal-context'

type Props = {
  children?: ReactElement
}

const ModalProvider: FC<Props> = ({ children }) => {
  const [modals, setModals] = useState<ModalProps[]>([]) // ToDo: add id
  const counterRef = useRef(0)

  const notify = useCallback((modalProps: ModalProps) => {
    const id = ++counterRef.current
    const modalWithId = { ...modalProps, id }
    setModals((prev) => [...prev, modalWithId])
  }, [])

  const closeModal = useCallback((id: number) => {
    setModals((prev) => prev.filter((modal) => modal.id !== id))
  }, [])

  const state: ModalContextState = {
    modals,
    notify,
    closeModal,
  }

  return <ModalContext.Provider value={state}>{children}</ModalContext.Provider>
}

export { ModalProvider }
