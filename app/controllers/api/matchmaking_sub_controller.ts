import MatchmakingService from '#services/matchmaking'
import { HttpContext } from '@adonisjs/core/http'
import { ReadableStream, ReadableStreamDefaultController } from 'node:stream/web'

export default class MatchmakingSubController {
  async index({ response }: HttpContext) {
    let controller: ReadableStreamDefaultController<any>
    const body = new ReadableStream({
      start(c) {
        controller = c
        MatchmakingService.getInstance().controllers.add(controller)
      },
      cancel() {
        MatchmakingService.getInstance().controllers.delete(controller)
      },
    })

    return response
      .header('Content-Type', 'text/event-stream')
      .header('Cache-Control', 'no-cache')
      .header('Connection', 'keep-alive')
  }
}
