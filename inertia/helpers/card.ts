export type Card = {
  id: string
  aspects?: Array<string>
  traits?: Array<string>
  arenas?: Array<string>
  cost: number
  modifiedCost?: number
  power?: number
  modifiedPower?: number
  hp?: number
  modifiedHp?: number
  exhaust?: boolean
  set: string
  number: string
  name: string
  subtitle?: string
  type: string
  frontText: string
  backText?: string
  epicAction?: string
  epicUsed?: boolean
  rarity: string
  unique: boolean
  keywords?: Array<string>
  owner: string
  side: string
  shield: number
  experience: number
  equipment: Array<Card>
}

export const hiddenCard = (
  cardUuid: string,
  ownerUuid: string,
  type: string,
  exhaust = false
): Card => {
  return initCard({
    id: cardUuid,
    cost: 0,
    set: 'no',
    number: '000',
    name: 'card_back',
    type,
    frontText: 'card_back',
    rarity: 'no',
    unique: false,
    owner: ownerUuid,
    side: ownerUuid,
    exhaust,
  })
}

export const initCard = (data: any): Card => {
  return {
    shield: 0,
    experience: 0,
    modifiedCost: data.cost ?? 0,
    modifiedPower: data.power ?? 0,
    modifiedHp: data.hp ?? 0,
    exhaust: false,
    ...data,
  }
}
