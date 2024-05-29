import React, { useEffect, useState } from 'react'
import { FC } from 'react'
import { createRoot } from 'react-dom/client'
import { Engine } from './engine'
import { ContextStartedEvent } from './events/context-started'
import { IContextNode } from './core/tree/types'

const Reactangle: FC<{ target: HTMLElement }> = ({ target }) => {
  const [isEntered, setIsEntered] = useState(false)
  useEffect(() => {
    const mouseEnterHandler = () => {
      setIsEntered(true)
    }
    const mouseLeaveHandler = () => {
      setIsEntered(false)
    }
    target.addEventListener('mouseenter', mouseEnterHandler)
    target.addEventListener('mouseleave', mouseLeaveHandler)

    return () => {
      target.removeEventListener('mouseenter', mouseEnterHandler)
      target.removeEventListener('mouseleave', mouseLeaveHandler)
    }
  }, [target])

  const bodyOffset = document.documentElement.getBoundingClientRect()
  const targetOffset = target.getBoundingClientRect()
  const targetHeight = targetOffset.height
  const targetWidth = targetOffset.width

  const topStyle: React.CSSProperties = {
    left: targetOffset.left - 4 - bodyOffset.left,
    top: targetOffset.top - 4 - bodyOffset.top,
    width: targetWidth + 5,
    background: 'blue',
    height: 3,
    position: 'absolute',
    transition: 'all 300ms ease',
  }

  const bottomStyle: React.CSSProperties = {
    top: targetOffset.top + targetHeight + 1 - bodyOffset.top,
    left: targetOffset.left - 3 - bodyOffset.left,
    width: targetWidth + 4,
    background: 'blue',
    height: 3,
    position: 'absolute',
    transition: 'all 300ms ease',
  }

  const leftStyle: React.CSSProperties = {
    left: targetOffset.left - 5 - bodyOffset.left,
    top: targetOffset.top - 4 - bodyOffset.top,
    height: targetHeight + 8,
    background: 'blue',
    width: 3,
    position: 'absolute',
    transition: 'all 300ms ease',
  }

  const rightStyle: React.CSSProperties = {
    left: targetOffset.left + targetWidth + 1 - bodyOffset.left,
    top: targetOffset.top - 4 - bodyOffset.top,
    height: targetHeight + 8,
    background: 'blue',
    width: 3,
    position: 'absolute',
    transition: 'all 300ms ease',
  }

  return (
    <div style={{ display: isEntered ? 'block' : 'none' }}>
      <div style={topStyle}></div>
      <div style={leftStyle}></div>
      <div style={rightStyle}></div>
      <div style={bottomStyle}></div>
    </div>
  )
}

const Index: FC<{ engine: Engine }> = ({ engine }) => {
  const [contexts, setContexts] = useState<IContextNode[]>([])
  const [elements, setElements] = useState<HTMLElement[]>([])

  useEffect(() => {
    const contextStartedHandler = (e: ContextStartedEvent) => {
      setContexts((prev) => [...prev, e.context])
      setElements((prev) => [...prev, e.element as HTMLElement])
    }

    engine.eventTarget.addEventListener('context-started', contextStartedHandler as any)

    return () => {
      engine.eventTarget.removeEventListener('context-started', contextStartedHandler as any)
    }
  }, [engine])

  return (
    <div>
      {elements.map((el, i) => (
        <Reactangle key={i} target={el} />
      ))}
    </div>
  )
}

export class App {
  constructor(engine: Engine) {
    const { viewportOuter, viewportInner } = this._createViewport()
    document.body.appendChild(viewportOuter)

    const root = createRoot(viewportInner)
    root.render(<Index engine={engine} />)
  }

  private _createViewport() {
    const viewport = document.createElement('div')
    viewport.setAttribute('data-mweb-shadow-host', '')
    const shadowRoot = viewport.attachShadow({ mode: 'open' })

    // It will prevent inheritance without affecting other CSS defined within the ShadowDOM.
    // https://stackoverflow.com/a/68062098
    const disableCssInheritanceStyle = document.createElement('style')
    disableCssInheritanceStyle.innerHTML = ':host { all: initial; }'
    shadowRoot.appendChild(disableCssInheritanceStyle)

    const viewportInner = document.createElement('div')
    viewportInner.setAttribute('data-bs-theme', 'light') // ToDo: parametrize

    // Context cannot be a shadow root node because mutation observer doesn't work there
    // So we need to select a child node for context
    viewportInner.setAttribute('data-mweb-context-type', 'shadow-dom')

    shadowRoot.appendChild(viewportInner)

    // Prevent event propagation from BOS-component to parent
    const EventsToStopPropagation = ['click', 'keydown', 'keyup', 'keypress']
    EventsToStopPropagation.forEach((eventName) => {
      viewport.addEventListener(eventName, (e) => e.stopPropagation())
    })

    return { viewportOuter: viewport, viewportInner }
  }
}
