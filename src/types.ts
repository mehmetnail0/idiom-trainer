export type Category = 'founder' | 'colloquial' | 'business'
export type Difficulty = 1 | 2 | 3
export type IdiomStatus = 'new' | 'learning' | 'mastered'

export type Idiom = {
  id: string
  phrase: string
  meaning: string
  example: string
  category: Category
  difficulty: Difficulty
  status: IdiomStatus
  correct: number
  wrong: number
  lastSeen: number | null
  nextDue: number | null
}

export type QuestionType = 'fill-blank' | 'meaning-match' | 'context-usage' | 'production'

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
  meaning: string
  example: string
}

export type Question = MCQuestion | ProdQuestion
