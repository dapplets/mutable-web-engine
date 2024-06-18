import { createContext } from 'react'

export type ModalProps = {
  subject: string
  body: string
  type: 'error' | 'info' | 'warning'
  id: number
  actions: {
    label: string
    onClick: () => void
  }[]
}

export type ModalContextState = {
  modals: ModalProps[]
  notify: (modalProps: ModalProps) => void
  closeModal: (id: number) => void
}

export const contextDefaultValues: ModalContextState = {
  modals: [],
  notify: () => {},
  closeModal: () => {},
}

export const ModalContext = createContext<ModalContextState>(contextDefaultValues)
