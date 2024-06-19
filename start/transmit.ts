import transmit from '@adonisjs/transmit/services/main'

transmit.on('connect', ({ uid }) => {
  console.log(`Connected: ${uid}`)
})
/*
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
    */

transmit.on('disconnect', ({ uid }) => {
  console.log(`Disconnected: ${uid}`)
})

// transmit.on('broadcast', ({ channel }) => {
//   console.log(`Broadcasted to channel ${channel}`)
// })

transmit.on('subscribe', ({ uid, channel, ctx }) => {
  console.log(`Subscribed ${uid} to ${channel}`, ctx.request.body())
})

transmit.on('unsubscribe', ({ uid, channel, ctx }) => {
  console.log(`Unsubscribed ${uid} from ${channel}`, ctx.request.body())
})
