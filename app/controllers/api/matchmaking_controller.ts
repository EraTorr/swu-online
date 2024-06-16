import { v4 as uuidv4 } from 'uuid'
import { redis } from '#services/valkey'
import { HttpContext } from '@adonisjs/core/http'
import MatchmakingService from '#services/matchmaking'

export default class MatchmakingController {
  async index(ctx: HttpContext) {
    if (ctx.request.header('Content-Type') === 'application/json') {
      let { uuid } = ctx.request.body()

      try {
        const opponentFound = await getOpponent(uuid)

        uuid = uuid instanceof String ? uuid : uuidv4()
        if (opponentFound) {
          console.log('opponentFound', opponentFound)
          const game = MatchmakingService.getInstance().createGame(uuid, opponentFound)
          return ctx.response.status(200).send(JSON.stringify({ uuid, game }))
        }

        const randNumber = Math.floor(Math.random() * 5) + 1
        await redis.zadd('matchmaking', { nx: true }, { score: randNumber, member: uuid })
      } catch (error) {
        console.error(error)
      }

      return ctx.response.status(200).send(JSON.stringify({ uuid }))
    }
    return ctx.response.status(400)
  }

  async delete({ request }: HttpContext) {
    const uuid = request
      .url()
      .split('?')
      .pop()
      ?.split('&')
      .filter((param) => param.includes('uuid='))[0]
      ?.split('=')
      .pop()

    if (uuid === undefined) {
      return new Response(null, { status: 404 })
    }
    await redis.zrem('matchmaking', uuid)
    return new Response(null, { status: 204 })
  }
}

// export const POST: APIRoute = async ({ request }) => {
//   let { uuid } = await request.json()
//   try {
//     const opponentFound = await getOpponent(uuid)

//     uuid = uuid instanceof String ? uuid : uuidv4()
//     if (opponentFound) {
//       console.log('opponentFound', opponentFound)
//       const game = MatchMakingController.getInstance().createGame(uuid, opponentFound)
//       return new Response(JSON.stringify({ uuid, game }), { status: 200 })
//     }

//     const randNumber = Math.floor(Math.random() * 5) + 1
//     await redis.zadd('matchmaking', { nx: true }, { score: randNumber, member: uuid })
//   } catch (error) {
//     console.error(error)
//   }

//   return new Response(JSON.stringify({ uuid }), { status: 200 })
// }

const getOpponent = async (uuidP1: string) => {
  let array = [1, 2, 3, 4, 5]
  let currentIndex = array.length

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }

  let uuidP2: string | null = null
  for (const number of array) {
    const res: Array<string> = await redis.zrange('matchmaking', number - 1, number + 1)
    const filtered = res.filter((uuid) => uuid !== uuidP1)
    if (filtered.length === 0) continue
    const t = Math.floor(Math.random() * filtered.length)
    uuidP2 = filtered[t]
    await redis.zrem('matchmaking', uuidP2)

    break
  }

  if (uuidP2) {
    return uuidP2
  }
  return null
}
