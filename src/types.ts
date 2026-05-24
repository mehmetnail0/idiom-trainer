export type ItemType = 'idiom' | 'word'

export type Item = {
  id: string
  type: ItemType
  phrase: string
  meaning: string
  examples: string[]
  notes: string
  // FSRS fields
  stability: number    // days until next review
  difficulty: number   // 1-10, affects interval growth
  reps: number         // successful reviews in a row
  lastReview: number | null
  nextDue: number | null
}

export type Rating = 1 | 2 | 3 | 4 // Again, Hard, Good, Easy

export type MCQuestion = {
  type: 'fill-blank' | 'meaning-match'
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
