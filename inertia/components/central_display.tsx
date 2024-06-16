import type { Component, JSXElement } from 'solid-js'
import '../style/central-display.scss'

interface CentralDisplayProps {
  children: JSXElement
  hideCentralDisplay: (e: any, value?: any) => void
}

export const CentralDisplay: Component<CentralDisplayProps> = (props) => {
  let element!: HTMLDivElement

  return (
    <div
      ref={element}
      class="central-display"
      classList={{ visible: !!props.children }}
      onClick={props.hideCentralDisplay}
    >
      <div class="cd_child">{props.children}</div>

      <button type="button" onClick={() => console.log('test')}>
        {' '}
        CLOSE{' '}
      </button>
    </div>
  )
}
