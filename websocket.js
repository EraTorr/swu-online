import { WebSocketServer } from 'ws'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3333'

const server = new WebSocketServer({ port: 8080 })
const connections = new Map()

server.on('connection', async function connection(ws) {
  ws.on('error', console.error)

  ws.on('message', async function message(data) {
    const message = await JSON.parse(data.toString())

    if (message.action === 'acknowledge') {
      const uuid = message.data.uuid
      connections.set(uuid, ws)
      try {
        const response = await axios.post(
          '/api/action',
          JSON.stringify({
            data: { gameId: message.data.gameId, uuid },
            action: 'acknowledge',
          }),
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        console.log('fetch', message.action)
      } catch (e) {
        console.log(e)
      }
    } else if (message.action && message.data) {
      try {
        const response = await axios.post('/api/action', JSON.stringify(message), {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        // await axios
        //   .post('http://localhost:3333/api/action')
        //   .body(JSON.stringify(message))
        //   .header('Content-Type', 'application/json')
        console.log('fetch', message.action)
      } catch (e) {
        console.log(e)
      }
    } else if (message.uuids && message.data) {
      console.log('send', message.uuids, message.data)

      message.uuids.forEach((uuid) => {
        connections.get(uuid).send(JSON.stringify(message.data))
      })
    }
  })

  ws.send(JSON.stringify({ response: 'Connected' }))
})
