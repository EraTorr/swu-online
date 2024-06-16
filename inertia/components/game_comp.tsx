import type { Component, JSXElement } from 'solid-js'
import { mergeProps, createSignal, onMount, Show, For } from 'solid-js'
import { GameCard } from './game_card.js'

import '../css/game.scss'
import { newListener } from '../helpers/app.helper.js'
import { Actions, type ActionsData } from './actions.js'
import { hiddenCard, type Card } from '../helpers/card.js'
import { Deck } from './deck.js'
import { OpponentHiddenCard } from './opponent_hidden_card.js'
import { DiscardPile } from './discard_pile.jsx'
import type { MoveCardType } from '#types/card.type.ts'
import { CentralDisplay } from './central_display.jsx'
import axios from 'axios'

export const GameComp: Component = (props) => {
  let element!: HTMLDivElement
  let myuuid: string
  let gameId: string
  let opponentUuid: string

  const [base, setBase] = createSignal<Card>()
  const [opponentBase, setOpponentBase] = createSignal<Card>()
  const [leader, setLeader] = createSignal<Card>()
  const [opponentLeader, setOpponentLeader] = createSignal<Card>()

  const [socket, setSocket] = createSignal<WebSocket | null>(null)
  const [actionsData, setActionsData] = createSignal<ActionsData | null>(null)
  // const [actionsArea, setActionsArea] = createSignal<string>('');
  // const [actionsCard, setActionsCard] = createSignal<string>('');
  const [cards, setCards] = createSignal<Array<Card>>([])
  const [opponentHandCount, setOpponentHandCount] = createSignal<number>(0)
  const [opponentHandCards, setOpponentHandCards] = createSignal<Array<Card>>([])
  const [opponentResourcesCards, setOpponentResourcesCards] = createSignal<Array<Card>>([])

  const [opponentResourcesCount, setOpponentResourcesCount] = createSignal<number>(11)
  const [opponentExhaustedResourcesCount, setOpponentExhaustedResourcesCount] =
    createSignal<number>(1)
  const [handCards, setHandCards] = createSignal<Array<Card>>([])
  const [deckCount, setDeckCount] = createSignal<number>(0)
  const [opponentDeckCount, setOpponentDeckCount] = createSignal<number>(0)
  const [discardPileCards, setDiscardPileCards] = createSignal<Array<Card>>([])
  const [opponentDiscardPileCards, setOpponentDiscardPileCards] = createSignal<Array<Card>>([])
  const [resourcesCards, setResourcesCards] = createSignal<Array<Card>>([])
  const [groundCards, setGroundCards] = createSignal<Array<Card>>([])
  const [spaceCards, setSpaceCards] = createSignal<Array<Card>>([])
  const [opponentGroundCards, setOpponentGroundCards] = createSignal<Array<Card>>([])
  const [opponentSpaceCards, setOpponentSpaceCards] = createSignal<Array<Card>>([])
  const [centralDisplayChildren, setCentralDisplayChildren] = createSignal<JSXElement>(null)

  const updateData = (data: any) => {
    console.log(data)
    if (myuuid === data.leaders.p1.owner) {
      setLeader(data.leaders.p1)
      setBase(data.bases.p1)
      setDeckCount(data.decksCount.p1)
      setResourcesCards(data.resources.p1)
      setHandCards(data.hands.p1)
      setGroundCards(data.grounds.p1)
      setSpaceCards(data.spaces.p1)
      setDiscardPileCards(data.discards.p1)

      setOpponentLeader(data.leaders.p2)
      setOpponentBase(data.bases.p2)
      setOpponentDeckCount(data.decksCount.p2)
      setOpponentResourcesCards(data.resources.p2)
      setOpponentHandCards(data.hands.p2)
      setOpponentGroundCards(data.grounds.p2)
      setOpponentSpaceCards(data.spaces.p2)
      setOpponentDiscardPileCards(data.discards.p2)
    } else {
      setLeader(data.leaders.p2)
      setBase(data.bases.p2)
      setDeckCount(data.decksCount.p2)
      setResourcesCards(data.resources.p2)
      setHandCards(data.hands.p2)
      setGroundCards(data.grounds.p2)
      setSpaceCards(data.spaces.p2)
      setDiscardPileCards(data.discards.p2)

      setOpponentLeader(data.leaders.p1)
      setOpponentBase(data.bases.p1)
      setOpponentDeckCount(data.decksCount.p1)
      setOpponentResourcesCards(data.resources.p1)
      setOpponentHandCards(data.hands.p1)
      setOpponentGroundCards(data.grounds.p1)
      setOpponentSpaceCards(data.spaces.p1)
      setOpponentDiscardPileCards(data.discards.p1)
    }
  }

  onMount(async () => {
    const game = JSON.parse(sessionStorage.getItem('game') as string)
    myuuid = localStorage.getItem('myuuid') as string
    gameId = game.gameId
    opponentUuid = game.p1 === myuuid ? game.p2 : game.p1

    const response = await axios.post('/api/matchmaking', JSON.stringify({ gameId }), {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.status === 400) {
      window.location.replace('pregame')
    }

    // Create WebSocket connection.
    const socket = new WebSocket('ws://' + window.location.hostname + ':8080/')
    setSocket(socket)

    // Connection opened
    newListener(socket, 'open', () => {
      socket.send(JSON.stringify({ action: 'acknowledge', data: { uuid: myuuid, gameId } }))
    })

    // Listen for messages
    newListener(socket, 'message', async (event) => {
      const data = await JSON.parse(event.data)

      console.log('message', data)
      if (data.step) {
        executeStep(data)
      } else {
        if (data.action) {
          if (data.action === 'sendDeck') {
            // send deck
            const deckParsed = JSON.parse(localStorage.getItem('deck') as string)
            socket.send(
              JSON.stringify({
                action: 'sendDeck',
                data: { gameId: gameId, uuid: myuuid, deck: deckParsed },
              })
            )
          }
          if (data.action === 'reconnect') {
            // send deck
            const deckParsed = JSON.parse(localStorage.getItem('deck') as string)
            socket.send(
              JSON.stringify({
                action: 'reconnect',
                data: { gameId: gameId, uuid: myuuid, deck: deckParsed },
              })
            )
          }
        }
      }
    })

    newListener(document, 'sendMessage', (event: CustomEvent) => {
      const e = event as CustomEvent
      console.log('sendMessage', e.detail)
      socket.send(JSON.stringify(e.detail))
    })

    newListener(socket, 'error', (event) => {
      console.log(event)
      window.location.replace('pregame')
    })
    // window.onbeforeunload = () => {
    // 	fetch("/api/close-ws", {method: "GET"})
    // }
  })

  const openActions = (e: ActionsData) => {
    setActionsData(e)
  }

  const sendEvent = (e: string, value?: any) => {
    const actionData = actionsData() as ActionsData
    const card = actionsData()?.card as Card
    console.log(actionsData())

    if (e.includes('moveto')) {
      setActionsData({
        ...actionData,
        type: 'moveto',
      })
    } else if (e.startsWith('to')) {
      const split = e.split('_')

      cardPushNewPosition(card, split[2], split[1], actionData.area)
      setActionsData(null)
      // TODO
    } else if (['draw', 'look', 'discard', 'heal', 'damage'].includes(e) && !value) {
      setActionsData({
        ...actionData,
        type: e,
      })
    } else if (['draw', 'look', 'discard', 'heal', 'damage'].includes(e)) {
      // const split = e.split('_');
      sendXAction(e, Number.parseInt(value), card)
      setActionsData(null)
    } else {
      setActionsData(null)
    }

    console.log(card, e, actionsData())
  }

  const executeStep = (data: any) => {
    const step = data.step

    switch (step) {
      case 'initGame':
        updateData(data)
        break
      case 'updateData':
        updateData(data)
        break
      case 'show':
        show(data)
        break
    }
  }

  const show = (data: any) => {
    if (data.type === 'cards') {
      let display = (
        <>
          <For each={data.cards}>
            {(card, index) => {
              return (
                <GameCard
                  name={card.id}
                  cardData={card}
                  pathFront={'SOR/' + card.number}
                  openActions={openActions}
                  area="resource"
                  pushNewPosition={cardPushNewPosition}
                ></GameCard>
              )
            }}
          </For>
        </>
      )
      setCentralDisplayChildren(display)
    }
  }

  const calculateInitialPositionAbsolute = (
    card: Card,
    index: number = 0,
    area: string | null = null
  ): { x: number; y: number } => {
    let side = 'top'
    if (card.side === myuuid) side = 'bottom'
    console.log('dsd', card.side, myuuid)
    if (area) {
      const el = element.querySelectorAll('.' + side + ' .' + area)[0]
      console.log('el.children.length', el.children.length)
      const b = el.getBoundingClientRect()
      return { x: b.left + b.width / 2 - 50, y: b.top + b.height / 2 - 71.8 / 2 }
    }

    if (['Base', 'Leader'].includes(card.type)) {
      const type = card.type.toLowerCase()
      console.log(card, side, type)

      const b = element.querySelectorAll('.' + side + ' .' + type)[0].getBoundingClientRect()
      return { x: b.left + b.width / 2 - 50, y: b.top + b.height / 2 - 71.8 / 2 }
    }
    return { x: 20 + index * 40, y: 20 + index * 40 }
  }

  const calculateInitialPositionRelative = (
    card: Card,
    index: number = 0,
    area: string | null = null
  ): { x: number; y: number } => {
    let side = 'top'
    if (card.side === myuuid) side = 'bottom'
    console.log('dsd', card.side, myuuid)
    if (area) {
      const el = element.querySelectorAll('.' + side + ' .' + area)[0]
      console.log('el.children.length', el.children.length)
      const b = el.getBoundingClientRect()
      return { x: b.width / 2 - 50, y: b.height / 2 - 50 }
    }

    if (['Base', 'Leader'].includes(card.type)) {
      const type = card.type.toLowerCase()
      console.log(card, side, type)

      const b = element.querySelectorAll('.' + side + ' .' + type)[0].getBoundingClientRect()
      return { x: b.width / 2 - 50, y: b.height / 2 - 71.8 / 2 }
    }
    return { x: 20 + index * 40, y: 20 + index * 40 }
  }

  const sendWS = (action: string, data: any) => {
    socket()?.send(JSON.stringify({ action, data: { gameId: gameId, ...data } }))
  }

  const cardPushNewPosition = (card: Card, side: string, area: string, fromArea: string): void => {
    const move: MoveCardType = {
      card,
      side,
      area,
      fromArea,
      playerUuid: myuuid,
    }
    sendWS('moveCard', { move })
  }

  const sendXAction = (action: string, count: number, card: Card): void => {
    const data: any = {
      value: count,
      playerUuid: myuuid,
      card: card,
      sideUuid: myuuid,
    }
    console.log('se', data)
    sendWS(action, { action: data })
    return
  }

  const showDiscardPile = (side: string): void => {
    if (side === 'player') {
      setCentralDisplayChildren(
        <For each={discardPileCards()}>
          {(card, index) => {
            return (
              <GameCard
                name={card.id}
                cardData={card}
                pathFront={card.number === '000' ? 'card_back' : 'SOR/' + card.number}
                pathBack={card.type === 'Leader' ? 'SOR/' + card.number + '-b' : undefined}
                openActions={openActions}
                area="hand"
                pushNewPosition={cardPushNewPosition}
              ></GameCard>
            )
          }}
        </For>
      )
    } else {
      setCentralDisplayChildren(
        <For each={opponentDiscardPileCards()}>
          {(card, index) => {
            return (
              <GameCard
                name={card.id}
                cardData={card}
                pathFront={card.number === '000' ? 'card_back' : 'SOR/' + card.number}
                pathBack={card.type === 'Leader' ? 'SOR/' + card.number + '-b' : undefined}
                openActions={openActions}
                area="hand"
                pushNewPosition={cardPushNewPosition}
              ></GameCard>
            )
          }}
        </For>
      )
    }
  }

  const hideCentralDisplay = (): void => {
    setCentralDisplayChildren(null)
  }

  return (
    <div ref={element} class="game">
      <div class="top">
        <div class="hand flex" data-action="top-hand">
          <For each={opponentHandCards()}>
            {(card, index) => {
              return (
                <GameCard
                  name={card.id}
                  cardData={card}
                  pathFront={card.number === '000' ? 'card_back' : 'SOR/' + card.number}
                  pathBack={card.type === 'Leader' ? 'SOR/' + card.number + '-b' : undefined}
                  openActions={openActions}
                  area="hand"
                  pushNewPosition={cardPushNewPosition}
                ></GameCard>
              )
            }}
          </For>
        </div>
        <div class="board">
          <div class="area-1">
            <div class="ressource flex" data-action="top-ressource">
              <For each={opponentResourcesCards()}>
                {(card, index) => {
                  return (
                    <GameCard
                      name={card.id}
                      cardData={card}
                      pathFront={'SOR/' + card.number}
                      pathBack={card.type === 'Leader' ? 'SOR/' + card.number + '-b' : undefined}
                      openActions={openActions}
                      area="resource"
                      pushNewPosition={cardPushNewPosition}
                    ></GameCard>
                  )
                }}
              </For>
            </div>
            <div class="deck flex" data-action="top-deck">
              <Deck left={opponentDeckCount()} openActions={openActions} side="opponent"></Deck>
            </div>
            <div class="discard flex" data-action="top-discard">
              <DiscardPile
                cardList={opponentDiscardPileCards()}
                showDiscardPile={showDiscardPile}
                side="opponent"
              ></DiscardPile>
            </div>
          </div>
          <div class="area-2">
            <div class="ground flex" data-action="top-ground">
              <For each={opponentGroundCards()}>
                {(card, index) => {
                  return (
                    <GameCard
                      name={card.id}
                      cardData={card}
                      pathFront={'SOR/' + card.number}
                      pathBack={card.type === 'Leader' ? 'SOR/' + card.number + '-b' : undefined}
                      openActions={openActions}
                      area="ground"
                      pushNewPosition={cardPushNewPosition}
                    ></GameCard>
                  )
                }}
              </For>
            </div>
            <div class="middle">
              <div class="leader flex" data-action="top-leader">
                <Show when={opponentLeader()}>
                  {(c) => {
                    const card = c()
                    return (
                      <GameCard
                        name={card.id}
                        cardData={card}
                        pathFront={'SOR/' + card.number}
                        pathBack={card.type === 'Leader' ? 'SOR/' + card.number + '-b' : undefined}
                        openActions={openActions}
                        area="leader"
                        pushNewPosition={cardPushNewPosition}
                      ></GameCard>
                    )
                  }}
                </Show>
              </div>
              <div class="base flex" data-action="top-base">
                <Show when={opponentBase()}>
                  {(c) => {
                    const card = c()
                    return (
                      <GameCard
                        name={card.id}
                        cardData={card}
                        pathFront={'SOR/' + card.number}
                        pathBack={card.type === 'Leader' ? 'SOR/' + card.number + '-b' : undefined}
                        openActions={openActions}
                        area="base"
                        pushNewPosition={cardPushNewPosition}
                      ></GameCard>
                    )
                  }}
                </Show>
              </div>
            </div>
            <div class="space flex" data-action="top-space">
              <For each={opponentSpaceCards()}>
                {(card, index) => {
                  return (
                    <GameCard
                      name={card.id}
                      cardData={card}
                      pathFront={'SOR/' + card.number}
                      pathBack={card.type === 'Leader' ? 'SOR/' + card.number + '-b' : undefined}
                      openActions={openActions}
                      area="space"
                      pushNewPosition={cardPushNewPosition}
                    ></GameCard>
                  )
                }}
              </For>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="board">
          <div class="area-2">
            <div class="ground flex" data-action="bottom-ground">
              <For each={groundCards()}>
                {(card, index) => {
                  return (
                    <GameCard
                      name={card.id}
                      cardData={card}
                      pathFront={'SOR/' + card.number}
                      pathBack={card.type === 'Leader' ? 'SOR/' + card.number + '-b' : undefined}
                      openActions={openActions}
                      area="ground"
                      pushNewPosition={cardPushNewPosition}
                    ></GameCard>
                  )
                }}
              </For>
            </div>
            <div class="middle">
              <div class="base flex" data-action="bottom-base">
                <Show when={base()}>
                  {(c) => {
                    const card = c()
                    return (
                      <GameCard
                        name={card.id}
                        cardData={card}
                        pathFront={'SOR/' + card.number}
                        pathBack={card.type === 'Leader' ? 'SOR/' + card.number + '-b' : undefined}
                        openActions={openActions}
                        area="base"
                        pushNewPosition={cardPushNewPosition}
                      ></GameCard>
                    )
                  }}
                </Show>
              </div>
              <div class="leader flex" data-action="bottom-leader">
                <Show when={leader()}>
                  {(c) => {
                    const card = c()
                    return (
                      <GameCard
                        name={card.id}
                        cardData={card}
                        pathFront={'SOR/' + card.number}
                        pathBack={card.type === 'Leader' ? 'SOR/' + card.number + '-b' : undefined}
                        openActions={openActions}
                        area="leader"
                        pushNewPosition={cardPushNewPosition}
                      ></GameCard>
                    )
                  }}
                </Show>
              </div>
            </div>
            <div class="space flex" data-action="bottom-space">
              <For each={spaceCards()}>
                {(card, index) => {
                  return (
                    <GameCard
                      name={card.id}
                      cardData={card}
                      pathFront={'SOR/' + card.number}
                      pathBack={card.type === 'Leader' ? 'SOR/' + card.number + '-b' : undefined}
                      openActions={openActions}
                      area="space"
                      pushNewPosition={cardPushNewPosition}
                    ></GameCard>
                  )
                }}
              </For>
            </div>
          </div>
          <div class="area-1">
            <div class="ressource flex" data-action="bottom-ressource">
              <For each={resourcesCards()}>
                {(card, index) => {
                  return (
                    <GameCard
                      name={card.id}
                      cardData={card}
                      pathFront={'SOR/' + card.number}
                      pathBack={card.type === 'Leader' ? 'SOR/' + card.number + '-b' : undefined}
                      openActions={openActions}
                      area="resource"
                      pushNewPosition={cardPushNewPosition}
                    ></GameCard>
                  )
                }}
              </For>
            </div>
            <div class="deck flex" data-action="bottom-deck">
              <Deck left={deckCount()} openActions={openActions} side="player"></Deck>
            </div>
            <div class="discard flex" data-action="bottom-discard">
              <DiscardPile
                cardList={discardPileCards()}
                showDiscardPile={showDiscardPile}
                side="player"
              ></DiscardPile>
            </div>
          </div>
        </div>
        <div class="hand flex" data-action="bottom-hand">
          <For each={handCards()}>
            {(card, index) => {
              return (
                <GameCard
                  name={card.id}
                  cardData={card}
                  pathFront={'SOR/' + card.number}
                  pathBack={card.type === 'Leader' ? 'SOR/' + card.number + '-b' : undefined}
                  openActions={openActions}
                  area="hand"
                  pushNewPosition={cardPushNewPosition}
                ></GameCard>
              )
            }}
          </For>
        </div>
      </div>

      <Show when={actionsData()}>
        <Actions data={actionsData() as ActionsData} sendEvent={sendEvent}></Actions>
      </Show>

      <Show when={centralDisplayChildren()}>
        <CentralDisplay hideCentralDisplay={hideCentralDisplay}>
          {centralDisplayChildren()}
        </CentralDisplay>
      </Show>
    </div>
  )
}
