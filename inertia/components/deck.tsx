import type { Component } from 'solid-js'
// import { stopEvent } from '../helpers/app.helper'
import '../style/deck.scss'

interface DeckProps {
  left: number
  openActions: (data: any) => void
  side: string
}

export const Deck: Component<DeckProps> = (props) => {
  const clickHandle = (event: any) => {
    // stopEvent(event)

    props.openActions({ type: 'deck', area: 'deck', side: props.side })
  }

  return (
    <div onClick={clickHandle} class="swu-deck">
      <span>{props.left}</span>
    </div>
  )
}
