import axios from 'axios'
import { onMount } from 'solid-js'
import { BackgroundStar } from '~/components/background_star'
import { transmit } from '~/js/transmit_client'

export default function Matchmaking() {
  onMount(async () => {
    if (!localStorage.getItem('deck')) window.location.replace('pregame')
    let myuuid = localStorage.getItem('myuuid')
    let matchmakingId = localStorage.getItem('matchmaking-id') ?? ''
    localStorage.removeItem('matchmaking-id')

    const response = await axios.post(
      '/api/matchmaking',
      JSON.stringify({ uuid: myuuid, matchmakingId: matchmakingId }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (response.status === 200) {
      const data = response.data

      localStorage.setItem('myuuid', data.uuid)

      if (data.game) {
        sessionStorage.setItem('game', JSON.stringify(data.game))
        window.location.replace('/game')
        return
      }
    }

    const subscription = transmit.subscription('matchmaking/' + response.data.uuid)
    await subscription.create()

    subscription.onMessage(async (data: any) => {
      sessionStorage.setItem('game', data)
      await subscription.delete()
      window.location.replace('/game')
    })

    window.addEventListener('unload', async function (e) {
      axios.delete('/api/matchmaking?uuid=' + myuuid)
    })
  })

  return (
    <>
      <BackgroundStar></BackgroundStar>
      <main class="matchmaking">
        <div class="home">
          <div class="title" style="color: aliceblue; font-size: 24px;">
            Looking for an opponent...
          </div>
        </div>
      </main>
    </>
  )
}
