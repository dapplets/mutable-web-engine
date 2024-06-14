import { createContext } from 'react'

export type ModalProps = {
  subject: string
  body: string
  type: 'error' | 'info' | 'warning'
}

export type ModalContextState = {
  modals: ModalProps[]
  notify: (modalProps: ModalProps) => void
}

export const contextDefaultValues: ModalContextState = {
  modals: [],
  notify: () => {},
}

export const ModalContext = createContext<ModalContextState>(contextDefaultValues)
