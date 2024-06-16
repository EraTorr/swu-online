import { mergeProps, type Component } from 'solid-js'
import { stopEvent } from '../helpers/app.helper'
import '../css/deck.scss'
import type { Card } from '../helpers/card'

interface DiscardPileProps {
  cardList?: Array<Card>
  showDiscardPile?: (data: any) => void
  side: string
}

export const DiscardPile: Component<DiscardPileProps> = (props) => {
  const merged = mergeProps(
    {
      cardList: [] as Array<Card>,
      showDiscardPile: (e: any) => console.log(e),
    },
    props
  )

  const clickHandle = (event: any) => {
    stopEvent(event)

    merged.showDiscardPile(props.side)
  }

  return (
    <div onClick={clickHandle} class="swu-deck">
      <span>{merged.cardList.length}</span>
    </div>
  )
}
