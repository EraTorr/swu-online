import { handleAction } from '#services/websocket'
import { HttpContext } from '@adonisjs/core/http'

export default class ActionController {
  async index({ request }: HttpContext) {
    if (request.header('Content-Type') === 'application/json') {
      const body = request.body()

      handleAction(body.action, body.data, null)
    }

    return new Response(null, { status: 204 })
  }
}
