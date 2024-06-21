import { createContext } from 'react'
export enum NotificationType {
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
}

export type ModalProps = {
  subject: string
  body: string
  type: NotificationType
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
