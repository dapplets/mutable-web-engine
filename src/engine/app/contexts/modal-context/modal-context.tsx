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
  notify: (modalProps: ModalProps) => void
}

export const contextDefaultValues: ModalContextState = {
  notify: () => {},
}

export const ModalContext = createContext<ModalContextState>(contextDefaultValues)
