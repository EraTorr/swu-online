import type { HttpContext } from '@adonisjs/core/http'

export default class GamesController {
  async board({ inertia }: HttpContext) {
    return inertia.render('game')
  }

  async pregame({ inertia }: HttpContext) {
    return inertia.render('pre_game')
  }

  async matchmaking({ inertia }: HttpContext) {
    return inertia.render('matchmaking')
  }
}
