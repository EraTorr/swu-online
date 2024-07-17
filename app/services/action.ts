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
  shuffleCard,
  changeStats,
  exhaustCard,
  changeExperience,
  changeShield,
  equipCard,
  unequipCard,
  shuffleBottomCard,
} from './game.js'

import { Card } from '#types/card.type.js'
import transmit from '@adonisjs/transmit/services/main'

export const handleAction = async (action: string, data: any) => {
  let game: GameType | null = null

  switch (action) {
    case 'acknowledge':
      game = getGame(data.gameId)
      if (game === null) break

      if (data.uuid === game.p1) {
        game.connected = {
          ...game.connected,
          p1: true,
        }
      } else {
        game.connected = {
          ...game.connected,
          p2: true,
        }
      }

      setGame(game)
      console.log(action, data, game.connected, game.p1, game.p2)

      const allConnected = game.connected.p1 && game.connected.p2

      if (game.decks.p1.fullDeck.length && game.decks.p2.fullDeck.length) {
        const responseData = { action: 'reconnect' }
        if (game.p1 === data.uuid) {
          broadcastResponse(game, responseData)
        } else {
          broadcastResponse(game, null, responseData)
        }
        break
      }

      if (allConnected) {
        const responseData = { action: 'sendDeck' }

        broadcastResponse(game, responseData, responseData)
      }
      break
    case 'sendDeck':
      game = getGame(data.gameId)

      if (!game) break

      const deck = data.deck
      const deckCard: Array<Card> = []

      deck.deck.forEach((card: any) => {
        for (let i = 0; i < card.count; i++) {
          deckCard.push(prepareDeckCard(card.id, data.uuid))
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
      if (data.move.fromArea === 'equip') {
        unequipCard(data.gameId, data.move)
      }
      moveCard(data.gameId, data.move)
      break
    case 'draw':
      drawCard(data.gameId, data.action)
      break
    case 'look':
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
      shuffleCard(data.gameId, data.action)
      break
    case 'shufflebottom':
      shuffleBottomCard(data.gameId, data.action)
      break
    case 'changestats':
      changeStats(data.gameId, data.action)
      break
    case 'changeexperience':
      changeExperience(data.gameId, data.action)
      break
    case 'changeshield':
      changeShield(data.gameId, data.action)
      break
    case 'exhaust':
      exhaustCard(data.gameId, data.action)
      break
    case 'invoke':
      moveCard(data.gameId, data.move)
      break
    case 'equip':
      equipCard(data.gameId, data.equip)
      break
  }
}

export const broadcastResponse = (game: GameType, dataP1: any = null, dataP2: any = null) => {
  if (dataP1) {
    transmit.broadcast(
      'game/' + game.gameId + '/' + game.p1,
      JSON.stringify({ uuids: [game.p1], data: dataP1 })
    )
  }
  if (dataP2) {
    transmit.broadcast(
      'game/' + game.gameId + '/' + game.p2,
      JSON.stringify({ uuids: [game.p2], data: dataP2 })
    )
  }
}
