import { BackgroundStar } from '~/components/background_star'
import { GameComponent } from '../components/game_component'
import '../css/main-game.scss'

export default function Game() {
  const toggleInfoDialog = () => {
    const dialog = document.querySelector('dialog') as HTMLDialogElement
    dialog.addEventListener(
      'click',
      () => {
        dialog.close()
      },
      { once: true }
    )

    dialog.showModal()
  }

  return (
    <>
      <BackgroundStar></BackgroundStar>

      <main class="game">
        <GameComponent></GameComponent>

        <dialog class="info-dialog">
          <div>
            <div class="info-dialog__title">Shortcuts</div>
            <div class="info-dialog__row">
              <div>Discard</div> <div>d + click on card</div>
            </div>
            <div class="info-dialog__row">
              <div>Draw</div> <div>d + click on deck</div>
            </div>
            <div class="info-dialog__row">
              <div>Exhaust</div> <div>e + click on card</div>
            </div>
            <div class="info-dialog__row">
              <div>Move</div> <div>shift + click on card then on area</div>
            </div>
          </div>
          <form method="dialog">
            <button>Close</button>
          </form>
        </dialog>

        <button class="info-dialog__open" onClick={() => toggleInfoDialog()}>
          ?
        </button>

        <script>
          if (!localStorage.getItem('deck') || !sessionStorage.getItem('game'))
          window.location.replace('pregame')
        </script>
      </main>
    </>
  )
}
