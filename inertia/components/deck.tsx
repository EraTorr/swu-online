import type { Component } from 'solid-js'
// import { stopEvent } from '../helpers/app.helper'
import '../css/deck.scss'

interface DeckProps {
  left: number
  openActions: (data: any) => void
  sendAction?: (action: string, data: any) => void
  uuid?: string
  side: string
}

export const Deck: Component<DeckProps> = (props) => {
  const clickHandle = (event: any) => {
    if (props.side === 'opponent') return
    if ((globalThis as any).keyPressed === 'd' && props.sendAction) {
      const data: any = {
        value: 1,
        playerUuid: props.uuid,
      }

      props.sendAction('draw', { action: data })
      return
    }

    props.openActions({ type: 'deck', area: 'deck', side: props.side })
  }

  return (
    <div onClick={clickHandle} class="swu-deck">
      <span>{props.left}</span>
    </div>
  )
}
