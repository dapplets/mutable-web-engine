import React, { FC, useState } from 'react'
import Toast from 'react-bootstrap/Toast'
// import { Engine, EngineConfig } from '../../engine'
// import { useCore } from '../../../react'
// import { useEngine } from '../contexts/engine-context'
import 'bootstrap/dist/css/bootstrap.min.css'

const IconAlert = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M8.57502 3.21665L1.51668 15C1.37116 15.252 1.29416 15.5377 1.29334 15.8288C1.29253 16.1198 1.36793 16.4059 1.51204 16.6588C1.65615 16.9116 1.86396 17.1223 2.11477 17.2699C2.36559 17.4174 2.65068 17.4968 2.94168 17.5H17.0583C17.3494 17.4968 17.6344 17.4174 17.8853 17.2699C18.1361 17.1223 18.3439 16.9116 18.488 16.6588C18.6321 16.4059 18.7075 16.1198 18.7067 15.8288C18.7059 15.5377 18.6289 15.252 18.4834 15L11.425 3.21665C11.2765 2.97174 11.0673 2.76925 10.8177 2.62872C10.5681 2.48819 10.2865 2.41437 10 2.41437C9.71357 2.41437 9.43196 2.48819 9.18235 2.62872C8.93275 2.76925 8.72358 2.97174 8.57502 3.21665Z"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M10 7.5V10.8333"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M10 14.1667H10.0088"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
)

const mockTitle = 'Notification Title'
const mockText = 'This is a mock notification text.'

export const Notification: FC<{ event: any }> = ({ event }) => {
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
  }

  const iconStyle: React.CSSProperties = {
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 0,
    margin: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#D0911A',
  }

  const toastHeaderStyle: React.CSSProperties = {
    paddingLeft: '3rem',
    borderBottom: 'none',
  }

  return (
    <div style={wrapperStyle} className="notification">
      <Toast>
        <Toast.Header style={toastHeaderStyle}>
          <div onClick={() => console.log(event, 'event')} style={iconStyle}>
            <IconAlert />
          </div>

          <strong className="me-auto">{mockTitle}</strong>
        </Toast.Header>
        <Toast.Body>{mockText}</Toast.Body>
      </Toast>
    </div>
  )
}
