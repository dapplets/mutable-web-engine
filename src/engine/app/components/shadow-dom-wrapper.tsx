import * as React from 'react'
import { createPortal } from 'react-dom'
import { StyleSheetManager } from 'styled-components'
import { StyleProvider } from '@ant-design/cssinjs'

const generateGuid = () => {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export interface ShadowDomWrapperProps {
  children?: React.ReactNode
  stylesheetSrc?: string
  className?: string
}

export const ShadowDomWrapper = React.forwardRef<HTMLDivElement, ShadowDomWrapperProps>(
  ({ children, stylesheetSrc, className }, ref) => {
    const myRef = React.useRef<HTMLDivElement | null>(null)
    const [root, setRoot] = React.useState<{
      container: HTMLDivElement
      stylesMountPoint: HTMLDivElement
    } | null>(null)

    // ToDo: to make sure that when stylesheetSrc changes, it doesn't get executed multiple times
    React.useLayoutEffect(() => {
      if (myRef.current) {
        const EventsToStopPropagation = ['click', 'keydown', 'keyup', 'keypress']

        const shadowRoot = myRef.current.attachShadow({ mode: 'open' })
        const stylesMountPoint = document.createElement('div')
        const container = document.createElement('div')
        shadowRoot.appendChild(stylesMountPoint)

        // It will prevent inheritance without affecting other CSS defined within the ShadowDOM.
        // https://stackoverflow.com/a/68062098
        const resetCssRules = `
            :host { 
            all: initial; 
            display: flex; 
            align-items: center;
            justify-content: center;
            /* position: relative; */
            visibility: visible !important;
            }
        `
        const disableCssInheritanceStyle = document.createElement('style')
        disableCssInheritanceStyle.innerHTML = resetCssRules
        shadowRoot.appendChild(disableCssInheritanceStyle)

        if (stylesheetSrc) {
          const externalStylesLink = document.createElement('link')
          externalStylesLink.rel = 'stylesheet'
          externalStylesLink.href = stylesheetSrc
          shadowRoot.appendChild(externalStylesLink)

          // ToDo: parametrize this bootstrap specific code
          container.setAttribute('data-bs-theme', 'light')
        }

        // For mweb parser that looks for contexts in shadow dom
        myRef.current.setAttribute('data-mweb-shadow-host', '')

        // Context cannot be a shadow root node because mutation observer doesn't work there
        // So we need to select a child node for context
        container.setAttribute('data-mweb-context-type', 'shadow-dom')
        container.setAttribute('data-mweb-context-parsed', `{"id":"${generateGuid()}"}`)

        shadowRoot.appendChild(container)

        // Prevent event propagation from BOS-component to parent
        EventsToStopPropagation.forEach((eventName) => {
          myRef.current!.addEventListener(eventName, (e) => e.stopPropagation())
        })

        // Refactored: moved from "myRef.current = node"
        if (typeof ref === 'function') {
          ref(container)
        } else if (ref) {
          ref.current = container
        }

        setRoot({ container, stylesMountPoint })
      } else {
        setRoot(null)
      }
    }, [myRef, stylesheetSrc])

    return (
      <div className={className} ref={myRef}>
        {root && children
          ? createPortal(
              <StyleSheetManager target={root.stylesMountPoint}>
                <StyleProvider container={root.stylesMountPoint}>
                  <>{children}</>
                </StyleProvider>
              </StyleSheetManager>,
              root.container
            )
          : null}
      </div>
    )
  }
)

ShadowDomWrapper.displayName = 'ShadowDomWrapper'
