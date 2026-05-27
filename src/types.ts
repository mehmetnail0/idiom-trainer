export type ItemType = 'idiom' | 'word'

export type Item = {
  id: string
  type: ItemType
  category?: string
  phrase: string
  meaning: string
  examples: string[]
  wrongExample?: string
  notes: string
  stability: number
  difficulty: number
  reps: number
  lastReview: number | null
  nextDue: number | null
  correctCount?: number
  archived?: boolean
}

export type MCQuestion = {
  type: 'fill-blank' | 'meaning-match' | 'sentence-judge'
  itemId: string
  prompt: string
  options: string[]
  correctIndex: number
}

export type DayStats = {
  date: string
  reviewed: number
  correct: number
  newLearned: number
}
