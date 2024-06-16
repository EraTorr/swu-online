import { GameComp } from '../components/game_comp'

export default function Game() {
  return (
    <main>
      <GameComp></GameComp>

      <script>
        if (!localStorage.getItem('deck') || !sessionStorage.getItem('game'))
        window.location.replace('pregame')
      </script>
    </main>
  )
}
