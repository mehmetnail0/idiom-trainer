export type Category = 'everyday' | 'business' | 'casual'
export type IdiomStatus = 'new' | 'learning' | 'mastered'

export type Idiom = {
  id: string
  phrase: string
  meaning: string
  examples: string[]
  notes: string
  category: Category
  status: IdiomStatus
  correct: number
  wrong: number
  lastSeen: number | null
  nextDue: number | null
}

export type MCQuestion = {
  type: 'fill-blank' | 'meaning-match' | 'context-usage'
  idiomId: string
  prompt: string
  options: string[]
  correctIndex: number
}

export type ProdQuestion = {
  type: 'production'
  idiomId: string
  prompt: string
}

export type Question = MCQuestion | ProdQuestion
