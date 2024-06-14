import React from 'react'
import { useModal } from '../contexts/modal-context'

export const ModalWindows = () => {
  const { modals } = useModal()

  // ToDo: use bootstrap here

  return modals.map(({ subject, body, type, actions }) => (
    <div key={subject} className={`alert alert-${type} alert-dismissible fade show`} role="alert">
      {body}
      <div>
        {actions?.map(({ label, onClick }) => (
          <button
            key={label}
            type="button"
            className="btn btn-primary"
            data-bs-dismiss="alert"
            onClick={onClick}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  ))
}
