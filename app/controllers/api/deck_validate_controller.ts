import type { HttpContext } from '@adonisjs/core/http'

export default class DeckValidateController {
  async index(ctx: HttpContext) {
    if (ctx.request.header('Content-Type') === 'application/json') {
      try {
        const { leader, base, deck } = ctx.request.body()
        if (leader === undefined || base === undefined || deck === undefined) {
          throw new Error('Missing leader, base or deck')
        }
        if (validateCardId(leader.id) && validateCardId(base.id) && validateDeck(deck)) {
          return ctx.response.status(200).send('Success')
        }
      } catch (e: any) {
        return ctx.response.status(400).send(e.message)
      }
    }
    return ctx.response.status(404)
  }
}

const regexCardId = /^[a-zA-Z]{3}_[0-9]{3}$/

const validateCardId = (id: string): boolean => {
  if (id === undefined) return false
  if (!regexCardId.test(id)) return false
  return true
}

const validateDeck = (deck: Array<{ id: string; count: number }>): boolean => {
  let totalCardCount = 0
  const errorCards = deck.filter((card) => {
    totalCardCount += card.count ?? 0
    return !(validateCardId(card.id) && card.count !== undefined)
  })
  return errorCards.length === 0 && totalCardCount >= 50
}
