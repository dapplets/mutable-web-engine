import React from 'react'
import { useModal } from '../contexts/modal-context'

export const ModalWindows = () => {
  const { modals } = useModal()

  // ToDo: use bootstrap here

  return modals.map(({ subject, body, type }) => (
    <div key={subject} className={`alert alert-${type} alert-dismissible fade show`} role="alert">
      {body}
    </div>
  ))
}
