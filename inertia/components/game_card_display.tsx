import { createSignal, onMount, type Component } from 'solid-js'
import '../css/game-card.scss'

interface GameCardDisplayProps {
  name: string
  pathFront: string
  amount?: number
}

export const GameCardDisplay: Component<GameCardDisplayProps> = (props) => {
  let element!: HTMLDivElement
  const [url, setUrl] = createSignal<string>('')

  onMount(() => {
    setUrl('https://ik.imagekit.io/nrqvxs6itqd/SWU/' + props.pathFront + '.webp')
    console.log(url)
  })

  return (
    <>
      <div ref={element} class="swu-card container">
        <img class="in-game" src={url()} alt={props.name} />
        <span>{props.amount}</span>
      </div>
      <img class="swu-card in-display" src={url()} alt={props.name} draggable="false" />
    </>
  )
}
