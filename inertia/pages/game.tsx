import { GameComponent } from '../components/game_component'
import '../css/main-game.css'

export default function Game() {
  return (
    <main class="game">
      <GameComponent></GameComponent>

      <dialog open>
        Shortcut:
        <div>d + click : to discard a card</div>
        <div>d + click (on deck): to draw a card</div>
        <div>e + click : to exhaust a card</div>
        <p>Salutations, à tous et à toutes !</p>
        <form method="dialog">
          <button>OK</button>
        </form>
      </dialog>

      <script>
        if (!localStorage.getItem('deck') || !sessionStorage.getItem('game'))
        window.location.replace('pregame')
      </script>
    </main>
  )
}
