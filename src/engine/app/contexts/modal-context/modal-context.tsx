import { createContext } from 'react'

export type ModalProps = {
  subject: string
  body: string
  type: 'error' | 'info' | 'warning'
  actions: {
    label: string
    onClick: () => void
  }[]
}

export type ModalContextState = {
  modals: ModalProps[]
  notify: (modalProps: ModalProps) => void
  closeModal: (subject: string) => void
}

export const contextDefaultValues: ModalContextState = {
  modals: [],
  notify: () => {},
  closeModal: () => {},
}

export const ModalContext = createContext<ModalContextState>(contextDefaultValues)
