import { Card } from './card.type.js'

export type GameType = {
  gameId: string
  p1: string
  p2: string
  decks: {
    p1: {
      fullDeck: Array<Card>
      playDeck: Array<Card>
    }
    p2: {
      fullDeck: Array<Card>
      playDeck: Array<Card>
    }
  }
  discards: {
    p1: {
      cards: Array<Card>
    }
    p2: {
      cards: Array<Card>
    }
  }
  hands: {
    p1: {
      cards: Array<Card>
    }
    p2: {
      cards: Array<Card>
    }
  }
  resources: {
    p1: {
      cards: Array<Card>
    }
    p2: {
      cards: Array<Card>
    }
  }
  grounds: {
    p1: {
      cards: Array<Card>
    }
    p2: {
      cards: Array<Card>
    }
  }
  spaces: {
    p1: {
      cards: Array<Card>
    }
    p2: {
      cards: Array<Card>
    }
  }
  leaders: {
    p1: Card | null
    p2: Card | null
  }
  bases: {
    p1: Card | null
    p2: Card | null
  }
}
