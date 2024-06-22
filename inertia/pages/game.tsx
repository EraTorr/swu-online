import { GameComponent } from '../components/game_component'
import '../css/main-game.css'

export default function Game() {
  return (
    <main>
      <GameComponent></GameComponent>

      <script>
        if (!localStorage.getItem('deck') || !sessionStorage.getItem('game'))
        window.location.replace('pregame')
      </script>
    </main>
  )
}
