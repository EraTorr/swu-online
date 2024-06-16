import { handleAction } from '#services/websocket'

export default class ActionController {
  async index({ request }: HttpContext) {
    if (request.header('Content-Type') === 'application/json') {
      const body = await request.json()

      handleAction(body.action, body.data, null)
    }

    return new Response(null, { status: 204 })
  }
}
