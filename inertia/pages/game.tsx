import { GameComponent } from '../components/game_component'

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
