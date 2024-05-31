import { ViewportElementId, ViewportInnerElementId } from './constants'

export class Viewport {
  public outer: HTMLDivElement
  public inner: HTMLDivElement

  constructor({ bosElementStyleSrc }: { bosElementStyleSrc?: string }) {
    const viewportOuter = document.createElement('div')
    viewportOuter.id = ViewportElementId
    viewportOuter.setAttribute('data-mweb-shadow-host', '')
    const shadowRoot = viewportOuter.attachShadow({ mode: 'open' })

    // It will prevent inheritance without affecting other CSS defined within the ShadowDOM.
    // https://stackoverflow.com/a/68062098
    const disableCssInheritanceStyle = document.createElement('style')
    disableCssInheritanceStyle.innerHTML = ':host { all: initial; }'
    shadowRoot.appendChild(disableCssInheritanceStyle)

    if (bosElementStyleSrc) {
      const externalStyleLink = document.createElement('link')
      externalStyleLink.rel = 'stylesheet'
      externalStyleLink.href = bosElementStyleSrc
      shadowRoot.appendChild(externalStyleLink)
    }

    const viewportInner = document.createElement('div')
    viewportInner.id = ViewportInnerElementId
    viewportInner.setAttribute('data-bs-theme', 'light') // ToDo: parametrize

    // Context cannot be a shadow root node because mutation observer doesn't work there
    // So we need to select a child node for context
    viewportInner.setAttribute('data-mweb-context-type', 'shadow-dom')

    shadowRoot.appendChild(viewportInner)

    // Prevent event propagation from BOS-component to parent
    const EventsToStopPropagation = ['click', 'keydown', 'keyup', 'keypress']
    EventsToStopPropagation.forEach((eventName) => {
      viewportOuter.addEventListener(eventName, (e) => e.stopPropagation())
    })

    this.outer = viewportOuter
    this.inner = viewportInner
  }
}
