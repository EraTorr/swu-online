import { usePage } from 'inertia-adapter-solid'
import { Show, createSignal, onMount } from 'solid-js'
import axios from 'axios'

export default function PreGame() {
  const [showMatchMakingButton, setShowMatchMakingButton] = createSignal<boolean>(false)

  onMount(() => {
    setShowMatchMakingButton(!!localStorage.getItem('deck'))
    console.log(usePage().props.errors ?? 'nop')
  })

  const saveDeckInLocalStorage = async () => {
    const deck = (document.getElementById('deck') as HTMLTextAreaElement).value

    try {
      const response = await axios.post('/api/deck-validate', deck, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 200) {
        localStorage.setItem('deck', deck)
        setShowMatchMakingButton(true)
      }
    } catch (e: any) {
      console.log(e)
    }
  }

  return (
    <main>
      <div class="home" x-data="pregame()">
        <div class="title">
          Hello, to play please copy a deck from <a href="https://swudb.com">swudb.com</a> in json
          format
        </div>
        <textarea name="deck" id="deck"></textarea>
        <button type="button" onClick={() => saveDeckInLocalStorage()}>
          Save deck locally (allow cookies)
        </button>

        <Show when={showMatchMakingButton()}>
          <a href="matchmaking">Search game</a>
        </Show>
      </div>
    </main>
  )
}
