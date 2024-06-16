import axios from 'axios'
import { onMount } from 'solid-js'

export default function Matchmaking() {
  onMount(async () => {
    if (!localStorage.getItem('deck')) window.location.replace('pre-game')
    let myuuid = localStorage.getItem('myuuid')

    const response = await axios.post('/api/matchmaking', JSON.stringify({ uuid: myuuid }), {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log(response)
    if (response.status === 200) {
      const data = await response.data

      localStorage.setItem('myuuid', data.uuid)

      if (data.game) {
        sessionStorage.setItem('game', JSON.stringify(data.game))
        window.location.replace('/game')
        return
      }
    }

    const eventSource = new EventSource('/api/matchmaking-sub')
    eventSource.onmessage = async (event) => {
      console.log('found-match-' + myuuid)
      sessionStorage.setItem('game', event.data)
      window.location.replace('/game')
    }

    window.addEventListener('unload', function (e) {
      if (!localStorage.getItem('deck')) return
      fetch('/api/matchmaking?uuid=' + myuuid, {
        method: 'DELETE',
        keepalive: true,
      })
    })
  })

  return (
    <main>
      <div class="home">
        <div class="title" style="color: aliceblue; font-size: 24px;">
          Looking for an opponent...
        </div>
      </div>
    </main>
  )
}
