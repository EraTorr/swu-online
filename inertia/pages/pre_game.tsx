import { For, JSXElement, Show, createSignal, onMount } from 'solid-js'
import axios from 'axios'
import { GameCardDisplay } from '~/components/game_card_display'
import '../css/pregame.scss'
import { BackgroundStar } from '~/components/background_star'

export default function PreGame() {
  const [showMatchMakingButton, setShowMatchMakingButton] = createSignal<boolean>(false)
  const [leader, setLeader] = createSignal<string>('')
  const [base, setBase] = createSignal<string>('')
  const [side, setSide] = createSignal<Array<Array<string | number>>>([])
  const [deck, setDeck] = createSignal<Array<Array<string>>>([])

  onMount(() => {
    readyForMatchmaking()
  })

  const readyForMatchmaking = () => {
    setShowMatchMakingButton(!!localStorage.getItem('deck'))
    if (showMatchMakingButton()) {
      const deckData = JSON.parse(localStorage.getItem('deck') as string)
      setDeck(deckData.deck.map((card: { id: string; count: number }) => [card.id, card.count]))
      setSide(
        deckData.sideboard.map((card: { id: string; count: number }) => [card.id, card.count])
      )
      setBase(deckData.base.id)
      setLeader(deckData.leader.id)
    }
  }

  const imageUrl = (id: string) => {
    const split = id.split('_')
    return split[0] + 'webp/' + split[1]
  }

  const cardDeckBuild = (card: Array<Array<string | number>>): JSXElement => {
    return card.length ? (
      <For each={card}>
        {(c, _i) => (
          <GameCardDisplay
            name={c[0] as string}
            pathFront={imageUrl(c[0] as string)}
            amount={c[1] as number}
          ></GameCardDisplay>
        )}
      </For>
    ) : null
  }

  const cardBaseBuild = (l: string, b: string): JSXElement => {
    return (
      <>
        <GameCardDisplay name={leader()} pathFront={imageUrl(leader())}></GameCardDisplay>
        <GameCardDisplay name={l} pathFront={imageUrl(l + '-b')}></GameCardDisplay>
        <GameCardDisplay name={b} pathFront={imageUrl(b)}></GameCardDisplay>
      </>
    )
  }

  const saveDeckInLocalStorage = async () => {
    const deckToValidate = (document.getElementById('deck') as HTMLTextAreaElement).value

    try {
      const response = await axios.post('/api/deck-validate', deckToValidate, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 200) {
        localStorage.setItem('deck', deckToValidate)
        readyForMatchmaking()
      }
    } catch (e: any) {
      // console.log(e)
    }
  }

  return (
    <>
      <BackgroundStar></BackgroundStar>
      <main class="pregame">
        <div class="home">
          <div>
            <div>
              To play please copy a deck from{' '}
              <a href="https://swudb.com" target="_swudb">
                swudb.com
              </a>{' '}
              in JSON format
            </div>
            <textarea name="deck" id="deck"></textarea>
            <button type="button" onClick={() => saveDeckInLocalStorage()}>
              Save deck locally (allow cookies)
            </button>
          </div>
          <Show when={showMatchMakingButton()}>
            <div>
              <label for="matchmaking-id">
                Code matchmaking with friend. Enter same text as your friend to join him (private
                game). <br />
                Let empty to be paired with the next player
              </label>
              <input
                name="matchmaking-id"
                id="matchmaking-id"
                onInput={(e) => localStorage.setItem('matchmaking-id', e.target.value)}
              />
              <a href="matchmaking">
                <button type="button">Search game</button>
              </a>
            </div>
          </Show>
        </div>
        <div class="card-list">
          <Show when={showMatchMakingButton()}>
            <span class="title">Deck</span>
            <div>{cardBaseBuild(leader(), base())}</div>
            <div>{cardDeckBuild(deck())}</div>
            <span class="title">Side</span>
            <div>{cardDeckBuild(side())}</div>
          </Show>
        </div>
      </main>
    </>
  )
}
