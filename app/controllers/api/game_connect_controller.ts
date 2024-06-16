import { getGame } from '#services/game'
import { HttpContext } from '@adonisjs/core/http'

export default class GameConnectController {
  async index({ request }: HttpContext) {
    const body = request.body()

    if (!getGame(body.gameId)) {
      return new Response(null, { status: 400 })
    }

    return new Response(null, { status: 204 })
  }
}
