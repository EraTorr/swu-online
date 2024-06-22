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

export type MoveCardType = {
  card: Card
  side: string
  area: string
  fromArea: string
  playerUuid: string
}
