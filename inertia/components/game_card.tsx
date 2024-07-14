import type { Component } from 'solid-js'
import { mergeProps, createSignal, For, onMount, Show } from 'solid-js'
import '../css/game-card.scss'
import type { Card } from '../helpers/card'
import { stopEvent } from '../helpers/app.helper'

interface GameCardProps {
  name: string
  cardData: Card
  pathFront: string
  pathBack?: string
  initPositionX?: number
  initPositionY?: number
  showActionList?: boolean
  owner?: number
  playerView?: number
  openActions: (data: any) => void
  area: string
  pushNewPosition: (card: Card, side: string, area: string, fromArea: string) => void
  zIndex?: number
}

export const GameCard: Component<GameCardProps> = (props) => {
  const merged = mergeProps(
    {
      name: '',
      pathFront: '',
      pathBack: 'card_back',
      initPositionX: 0,
      initPositionY: 0,
      showActionList: true,
      owner: 1, // 2
      playerView: 1, // 2
    },
    props
  )

  const [following, setFollowing] = createSignal(false)
  const [showActionListAlpine, setShowActionListAlpine] = createSignal(false)
  const [visibleSide, setVisibleSide] = createSignal('front')
  const [left, setLeft] = createSignal(merged.initPositionX)
  const [top, setTop] = createSignal(merged.initPositionY)

  let element!: HTMLDivElement
  onMount(() => {
    if (merged.area === 'resource') {
      setVisibleSide('back')
    }
  })

  const urlVisible = (display = false) => {
    console.log(display, merged.pathBack, merged.playerView, merged.cardData.type, merged.owner)
    if (display && merged.pathBack === 'card_back' && merged.playerView === merged.owner) {
      return 'https://ik.imagekit.io/nrqvxs6itqd/SWU/' + merged.pathFront + '.webp'
    }
    if (merged.cardData.type === 'Base') {
      return 'https://ik.imagekit.io/nrqvxs6itqd/SWU/' + merged.pathFront + '.webp'
    }
    if (merged.cardData.type === 'Leader' && ['ground', 'space'].includes(merged.area)) {
      return 'https://ik.imagekit.io/nrqvxs6itqd/SWU/' + merged.pathBack + '.webp'
    }
    return (
      'https://ik.imagekit.io/nrqvxs6itqd/SWU/' +
      (visibleSide() === 'back' ? merged.pathBack : merged.pathFront) +
      '.webp'
    )
  }

  const follow = (event: any) => {
    stopEvent(event)

    if (!following()) {
      setFollowing(true)
      element.classList.add('selected')
      handleMouseMove(event)
      document.addEventListener('mousemove', handleMouseMove)
    } else {
      const dataPush = identifyClickArea(event)
      if (dataPush) {
        setFollowing(false)
        element.classList.remove('selected')
        document.removeEventListener('mousemove', handleMouseMove)
        props.pushNewPosition(props.cardData, dataPush.side, dataPush.area, props.area)
        setLeft(0)
        setTop(0)
      }
    }
    if (showActionListAlpine()) {
      toggleActionList()
    }
  }

  const identifyClickArea = (event: any) => {
    const els = document.elementsFromPoint(event.clientX, event.clientY) as Array<HTMLElement>

    let [playerZone, area] = ['', '']
    for (const el of els) {
      const dataAction = el.dataset.action
      if (dataAction) {
        ;[playerZone, area] = dataAction.split('-')
        break
      }
    }

    if (playerZone === '') {
      return null
    }

    return { side: playerZone === 'top' ? 'opponent' : 'player', area }
  }

  const handleMouseMove = (event: any) => {
    const { clientX, clientY } = event
    const domRect = element.getBoundingClientRect()

    setLeft(-domRect.width / 2 + clientX)
    setTop(-domRect.height / 2 + clientY)
  }

  const flip = (event: any) => {
    stopEvent(event)

    setVisibleSide(visibleSide() === 'back' ? 'front' : 'back')
  }
  const toggleActionList = () => {
    setShowActionListAlpine(!showActionListAlpine())
  }
  const clickHandle = (event: any) => {
    stopEvent(event)
    if (event.ctrlKey) {
      flip(event)
      return
    }
    if (event.shiftKey || following()) {
      follow(event)
      return
    }

    merged.openActions({ type: merged.cardData.type, card: merged.cardData, area: merged.area })
  }

  const alt =
    merged.cardData.name +
    (merged.cardData.subtitle ? ' - ' + merged.cardData.subtitle : '') +
    ' ' +
    merged.cardData.set +
    merged.cardData.number

  return (
    <>
      <div
        ref={element}
        class="swu-card container"
        onClick={clickHandle}
        style={
          'top:' +
          top() +
          'px; left: ' +
          left() +
          'px;' +
          (merged.zIndex ? 'z-index:' + merged.zIndex : '')
        }
        classList={{ exhausted: !!merged.cardData.exhaust }}
      >
        <img class="in-game" src={urlVisible()} alt={alt} draggable="false" />
        <Show when={['space', 'ground'].includes(merged.area) && merged.cardData.modifiedHp}>
          <Show when={merged.cardData.experience}>
            <span class="stats xp">
              {merged.cardData.experience} <span>XP</span>
            </span>
          </Show>
          <Show when={merged.cardData.shield}>
            <span class="stats shield">{merged.cardData.shield}</span>
          </Show>
          <span class="stats power">{merged.cardData.modifiedPower}</span>
          <span class="stats hp">{merged.cardData.modifiedHp}</span>
        </Show>
        <Show when={['base'].includes(merged.area)}>
          <Show when={merged.cardData.shield}>
            <span class="stats shield">{merged.cardData.shield}</span>
          </Show>
          <span class="stats hp">{merged.cardData.modifiedHp}</span>
        </Show>
        <Show when={merged.cardData.equipment.length}>
          <div class="card-child">
            <For each={merged.cardData.equipment}>
              {(card, index) => {
                return (
                  <GameCard
                    name={card.id}
                    cardData={card}
                    pathFront={
                      card.number === '000' ? 'card_back' : card.set + 'webp/' + card.number
                    }
                    pathBack={
                      card.type === 'Leader' ? card.set + 'webp/' + card.number + '-b' : undefined
                    }
                    openActions={merged.openActions}
                    area="hand"
                    pushNewPosition={merged.pushNewPosition}
                    initPositionY={(index() + 1) * 10}
                    zIndex={10 - index()}
                  ></GameCard>
                )
              }}
            </For>
          </div>
        </Show>
      </div>
      <Show when={merged.cardData.number !== '0' && merged.cardData.number !== '000'}>
        <img class="swu-card in-display" src={urlVisible(true)} alt={alt} draggable="false" />
      </Show>
    </>
  )
}
