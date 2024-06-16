import { v4 as uuidv4 } from 'uuid'
import { setGame } from './game.js'
import { ReadableStreamDefaultController } from 'node:stream/web'

export default class MatchmakingService {
  private static instance: MatchmakingService
  private constructor() {}

  controllers = new Set<ReadableStreamDefaultController>()

  static getInstance(): MatchmakingService {
    if (!MatchmakingService.instance) {
      MatchmakingService.instance = new MatchmakingService()
    }
    return MatchmakingService.instance
  }

  // private gameState: {} = {
  //     p1: '',
  //     p2: '',
  //     gameId: '',
  //     decks: {},
  //     hands: {},
  //     resources: {},
  //     grounds: {},
  //     spaces: {},
  //     leaders: {},
  //     bases: {},
  // };

  createGame = (uuidP1: string, uuidP2: string) => {
    const idStartingPlayer = Math.floor(Math.random() * 2)
    const player1 = [uuidP1, uuidP2][idStartingPlayer]
    const player2 = [uuidP1, uuidP2][1 - idStartingPlayer]
    const gameState = {
      p1: player1,
      p2: player2,
      gameId: uuidv4(),
      decks: { p1: { fullDeck: [], playDeck: [] }, p2: { fullDeck: [], playDeck: [] } },
      hands: { p1: { cards: [] }, p2: { cards: [] } },
      resources: { p1: { cards: [] }, p2: { cards: [] } },
      grounds: { p1: { cards: [] }, p2: { cards: [] } },
      spaces: { p1: { cards: [] }, p2: { cards: [] } },
      discards: { p1: { cards: [] }, p2: { cards: [] } },
      leaders: { p1: null, p2: null },
      bases: { p1: null, p2: null },
    }

    setGame(gameState)

    const encoder = new TextEncoder()
    const message = encoder.encode(`data: ${JSON.stringify(gameState)}\n\n`)

    console.log(this.controllers)
    this.controllers.forEach((controller: ReadableStreamDefaultController) =>
      controller.enqueue(message)
    )
    return gameState
  }
}
