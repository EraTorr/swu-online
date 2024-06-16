import { WebSocket, WebSocketServer } from 'ws'
import {
  damageCard,
  discardCard,
  drawCard,
  getGame,
  healCard,
  lookCard,
  moveCard,
  prepareDeckCard,
  reconnect,
  setGame,
  startPhase,
  type GameType,
  shuffleDeck,
} from './game.js'
import { Card } from '#types/card.type.js'

export default class WebsocketController {
  private static server: WebSocketServer
  static connections: Map<string, any> = new Map()

  static getInstance(): WebSocketServer {
    if (!WebsocketController.server) {
      try {
        WebsocketController.server = new WebSocketServer({ port: 8080 })
      } catch (e) {
        console.log(e)
      }

      WebsocketController.server.on('connection', function connection(ws) {
        ws.on('error', console.error)

        ws.on('message', async function message(data) {
          const message = await JSON.parse(data.toString())
          if (message.action && message.data) {
            handleAction(message.action, message.data, ws)
          }
        })

        ws.send(JSON.stringify({ response: 'Connected' }))
      })
    }
    return WebsocketController.server
  }
}

export const handleAction = async (action: string, data: any, ws: WebSocket | null = null) => {
  let game: GameType | null = null

  switch (action) {
    case 'acknowledge':
      WebsocketController.connections.set(data.uuid, ws)
      game = getGame(data.gameId)
      if (game === null) break

      const allConnected =
        [...WebsocketController.connections.keys()].filter((uuid: any) =>
          [game?.p1, game?.p2].includes(uuid)
        ).length === 2

      if (game.decks.p1.fullDeck.length && game.decks.p2.fullDeck.length) {
        console.log('reconnect', data.uuid)
        if (game.p1 === data.uuid) {
          const dataP1 = { action: 'reconnect' }
          sendWS(game, dataP1, null)
        } else {
          const dataP2 = { action: 'reconnect' }
          sendWS(game, null, dataP2)
        }
        break
      }
      if (allConnected) {
        const dataP1 = { action: 'sendDeck' }
        const dataP2 = { action: 'sendDeck' }
        sendWS(game, dataP1, dataP2)
      }
      break
    case 'sendDeck':
      game = getGame(data.gameId)

      if (!game) break

      const deck = data.deck
      const deckCard: Array<Card> = []

      deck.deck.forEach((card: any) => {
        for (let i = 0; i < card.count; i++) {
          deckCard.push(prepareDeckCard(card.id, data.uuid, i))
        }
      })

      let updatedGame = structuredClone(game)
      if (game.p1 === data.uuid) {
        updatedGame = {
          ...game,
          decks: {
            ...game.decks,
            p1: {
              fullDeck: deckCard,
              playDeck: shuffleDeck(deckCard),
            },
          },
          leaders: {
            ...game.leaders,
            p1: prepareDeckCard(deck.leader.id, data.uuid),
          },
          bases: {
            ...game.bases,
            p1: prepareDeckCard(deck.base.id, data.uuid),
          },
        }
      } else {
        updatedGame = {
          ...game,
          decks: {
            ...game.decks,
            p2: {
              fullDeck: deckCard,
              playDeck: shuffleDeck(deckCard),
            },
          },
          leaders: {
            ...game.leaders,
            p2: prepareDeckCard(deck.leader.id, data.uuid),
          },
          bases: {
            ...game.bases,
            p2: prepareDeckCard(deck.base.id, data.uuid),
          },
        }
      }

      setGame(updatedGame)

      if (updatedGame.decks.p1.fullDeck.length && updatedGame.decks.p2.fullDeck.length) {
        console.log(
          'test',
          updatedGame.decks.p1.fullDeck.length,
          updatedGame.decks.p2.fullDeck.length
        )
        startPhase(updatedGame.gameId)
      }
      break
    case 'reconnect':
      reconnect(data.gameId, data.uuid)
      break
    case 'moveCard':
      console.log(data)
      moveCard(data.gameId, data.move)
      break
    case 'draw':
      drawCard(data.gameId, data.action)
      break
    case 'look':
      console.log('look', data)

      lookCard(data.gameId, data.action)
      break
    case 'discard':
      discardCard(data.gameId, data.action)
      break
    case 'heal':
      healCard(data.gameId, data.action)
      break
    case 'damage':
      damageCard(data.gameId, data.action)
      break
    case 'shuffle':
      // shuffleCard(data.gameId, data.shuffle);
      break
  }
}

export const sendWS = (game: GameType, dataP1: any, dataP2: any) => {
  let responseP1 = null
  let responseP2 = null
  if (dataP1) responseP1 = JSON.stringify({ uuids: [game.p1], data: dataP1 })
  if (dataP2) responseP2 = JSON.stringify({ uuids: [game.p2], data: dataP2 })
  const socket = new WebSocket('ws://localhost:8080/')
  socket.addEventListener('open', () => {
    if (responseP1) socket.send(responseP1)
    if (responseP2) socket.send(responseP2)
    socket.close()
  })
}
