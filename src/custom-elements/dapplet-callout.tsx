import * as React from 'react'
import { createPortal } from 'react-dom'
import { StyleSheetManager } from 'styled-components'

const ShadowDom: React.FC<any> = React.forwardRef(({ children, style, ...props }, ref) => {
  const myRef = React.useRef<HTMLDivElement | null>(null)
  const [root, setRoot] = React.useState<{
    container: HTMLDivElement
    stylesMountPoint: HTMLDivElement
  } | null>(null)

  React.useLayoutEffect(() => {
    if (myRef.current) {
      const EventsToStopPropagation = ['click', 'keydown', 'keyup', 'keypress']

      const shadowRoot = myRef.current.attachShadow({ mode: 'closed' })
      const stylesMountPoint = document.createElement('div')
      const container = document.createElement('div')
      shadowRoot.appendChild(stylesMountPoint)

      // It will prevent inheritance without affecting other CSS defined within the ShadowDOM.
      // https://stackoverflow.com/a/68062098
      const disableCssInheritanceStyle = document.createElement('style')
      disableCssInheritanceStyle.innerHTML = ':host { all: initial; }'
      shadowRoot.appendChild(disableCssInheritanceStyle)

      shadowRoot.appendChild(container)

      // Prevent event propagation from BOS-component to parent
      EventsToStopPropagation.forEach((eventName) => {
        myRef.current!.addEventListener(eventName, (e) => e.stopPropagation())
      })

      setRoot({ container, stylesMountPoint })
    } else {
      setRoot(null)
    }
  }, [myRef])

  return (
    <div
      ref={(node) => {
        myRef.current = node
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      }}
      style={style}
      {...props}
    >
      {root
        ? createPortal(
            <StyleSheetManager target={root.stylesMountPoint}>
              <>{children}</>
            </StyleSheetManager>,
            root.container
          )
        : null}
    </div>
  )
})

function getInitialPopperStyles(
  position: React.CSSProperties['position'] = 'absolute'
): Partial<React.CSSProperties> {
  return {
    position,
    top: '0',
    left: '0',
    opacity: '0',
    pointerEvents: 'none',
  }
}

const Callout: React.FC<any> = React.forwardRef(
  (
    {
      children,
      bsPrefix,
      placement = 'right',
      className,
      style,
      arrowProps,
      hasDoneInitialMeasure,
      popper,
      show,
      arrow,
      ...props
    },
    ref
  ) => {
    let computedStyle = style
    if (show && !hasDoneInitialMeasure) {
      computedStyle = {
        ...style,
        ...getInitialPopperStyles(popper?.strategy),
      }
    }

    return (
      <ShadowDom {...props} ref={ref as any} style={style}>
        <div className="callout-arrow" {...arrowProps}>{arrow}</div>
        <div className="callout-inner">{children}</div>
      </ShadowDom>
    )
  }
)

export const DappletCallout = ({ children, ...otherProps }: { children: React.ReactNode[] }) => {
  return <Callout {...otherProps}>{children}</Callout>
}
