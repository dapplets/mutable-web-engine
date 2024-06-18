import React from 'react'
import { useModal } from '../contexts/modal-context'
import Toast from 'react-bootstrap/Toast'
import 'bootstrap/dist/css/bootstrap.min.css'
import ToastContainer from 'react-bootstrap/ToastContainer'
import styled from 'styled-components'

const IconAlert = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M8.57502 3.21665L1.51668 15C1.37116 15.252 1.29416 15.5377 1.29334 15.8288C1.29253 16.1198 1.36793 16.4059 1.51204 16.6588C1.65615 16.9116 1.86396 17.1223 2.11477 17.2699C2.36559 17.4174 2.65068 17.4968 2.94168 17.5H17.0583C17.3494 17.4968 17.6344 17.4174 17.8853 17.2699C18.1361 17.1223 18.3439 16.9116 18.488 16.6588C18.6321 16.4059 18.7075 16.1198 18.7067 15.8288C18.7059 15.5377 18.6289 15.252 18.4834 15L11.425 3.21665C11.2765 2.97174 11.0673 2.76925 10.8177 2.62872C10.5681 2.48819 10.2865 2.41437 10 2.41437C9.71357 2.41437 9.43196 2.48819 9.18235 2.62872C8.93275 2.76925 8.72358 2.97174 8.57502 3.21665Z"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 7.5V10.8333"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 14.1667H10.0088"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const IconInfo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <g clipPath="url(#clip0_10_108)">
      <path
        d="M9.99996 18.3334C14.6023 18.3334 18.3333 14.6024 18.3333 10C18.3333 5.39765 14.6023 1.66669 9.99996 1.66669C5.39759 1.66669 1.66663 5.39765 1.66663 10C1.66663 14.6024 5.39759 18.3334 9.99996 18.3334Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 5V10L13.3333 11.6667"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_10_108">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
)

const IconError = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <g clipPath="url(#clip0_10_182)">
      <path
        d="M6.54996 1.66669H13.45L18.3333 6.55002V13.45L13.45 18.3334H6.54996L1.66663 13.45V6.55002L6.54996 1.66669Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 7.5L7.5 12.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 7.5L12.5 12.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_10_182">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
)

const ButtonAction = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #02193a;
  outline: none;
  width: 86px;
  height: 30px;
  border-radius: 90px;
  background: #fff;
  color: #02193a;
  &:hover {
    background: #02193a;
    color: #fff;
  }
`

const IconWrapper = styled.div<{ $type: 'error' | 'info' | 'warning' }>`
  border-top-left-radius: 10px;
  border-bottom-right-radius: 10px;
  padding: 0;
  margin: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) =>
    props.$type === 'error' ? '#DB504A' : props.$type === 'warning' ? '#d0911a' : '#384BFF'};
`

export const ModalWindows = () => {
  const { modals, closeModal } = useModal()

  const wrapperStyle: React.CSSProperties = {
    borderRadius: '10px',
    border: '1px solid #02193A',
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    zIndex: 99999999,
    transition: 'all .2s ease-in-out',
    boxSizing: 'border-box',
    overflow: 'hidden',
    fontFamily: 'sans-serif',
  }

  const toastHeaderStyle: React.CSSProperties = {
    paddingLeft: '3rem',
    borderBottom: 'none',
  }

  const toastBodyStyle: React.CSSProperties = {
    color: '#7A818B',
  }

  const buttonsBlockStyle: React.CSSProperties = {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    padding: '10px',
  }

  return (
    <ToastContainer position="top-end">
      {modals.map(({ subject, body, type, actions, id }) => (
        <Toast
          key={id}
          show={subject ? true : false}
          onClose={() => closeModal(id)}
          style={wrapperStyle}
        >
          <Toast.Header className={`alert-${type.toLowerCase()}`} style={toastHeaderStyle}>
            <IconWrapper $type={type}>
              {type.toLowerCase() === 'error' ? (
                <IconError />
              ) : type.toLowerCase() === 'warning' ? (
                <IconAlert />
              ) : (
                <IconInfo />
              )}
            </IconWrapper>

            <strong className="me-auto">{subject}</strong>
          </Toast.Header>
          <Toast.Body style={toastBodyStyle}> {body}</Toast.Body>
          <div style={buttonsBlockStyle}>
            {actions?.map(({ label, onClick }) => (
              <ButtonAction
                key={label}
                onClick={() => {
                  onClick()
                  closeModal(id)
                }}
              >
                {label}
              </ButtonAction>
            ))}
          </div>
        </Toast>
      ))}
    </ToastContainer>
  )
}
