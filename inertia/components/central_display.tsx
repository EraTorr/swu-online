import type { Component, JSXElement } from 'solid-js'
import '../css/central-display.scss'

interface CentralDisplayProps {
  children: JSXElement
  hideCentralDisplay: (e: any, value?: any) => void
}

export const CentralDisplay: Component<CentralDisplayProps> = (props) => {
  let element!: HTMLDivElement

  return (
    <div ref={element} class="central-display" classList={{ visible: !!props.children }}>
      <div class="cd_child">{props.children}</div>

      <button type="button" onClick={props.hideCentralDisplay}>
        {' '}
        CLOSE{' '}
      </button>
    </div>
  )
}
