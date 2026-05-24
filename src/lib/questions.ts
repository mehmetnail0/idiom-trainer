import type { Idiom, Question, QuestionType } from '../types'

function shuffle<T>(arr: T[]): T[] {
  const c = [...arr]
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[c[i], c[j]] = [c[j], c[i]]
  }
  return c
}

function esc(s: string) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }

function distractors(target: Idiom, all: Idiom[], n: number) {
  return shuffle(all.filter(i => i.id !== target.id)).slice(0, n)
}

function fillBlank(idiom: Idiom, all: Idiom[]): Question {
  const blank = idiom.example.replace(new RegExp(esc(idiom.phrase), 'gi'), '___')
  const d = distractors(idiom, all, 3)
  const opts = shuffle([idiom, ...d].map(i => i.phrase))
  return { type: 'fill-blank', idiomId: idiom.id, prompt: blank, options: opts, correctIndex: opts.indexOf(idiom.phrase) }
}

function meaningMatch(idiom: Idiom, all: Idiom[]): Question {
  const d = distractors(idiom, all, 3)
  const opts = shuffle([idiom, ...d].map(i => i.meaning))
  return { type: 'meaning-match', idiomId: idiom.id, prompt: `What does "${idiom.phrase}" mean?`, options: opts, correctIndex: opts.indexOf(idiom.meaning) }
}

function contextUsage(idiom: Idiom, all: Idiom[]): Question {
  const d = distractors(idiom, all, 3)
  const correct = idiom.example
  const wrong = d.map(x => x.example.replace(new RegExp(esc(x.phrase), 'gi'), idiom.phrase))
  const opts = shuffle([correct, ...wrong])
  return { type: 'context-usage', idiomId: idiom.id, prompt: `Which sentence uses "${idiom.phrase}" correctly?`, options: opts, correctIndex: opts.indexOf(correct) }
}

function production(idiom: Idiom): Question {
  return { type: 'production', idiomId: idiom.id, prompt: `Use "${idiom.phrase}" in a sentence about building a startup or creating content.`, meaning: idiom.meaning, example: idiom.example }
}

const weights: QuestionType[] = ['fill-blank', 'fill-blank', 'fill-blank', 'meaning-match', 'meaning-match', 'meaning-match', 'context-usage', 'context-usage', 'production']

export function generateQuestion(idiom: Idiom, all: Idiom[]): Question {
  const t = weights[Math.floor(Math.random() * weights.length)]
  switch (t) {
    case 'fill-blank': return fillBlank(idiom, all)
    case 'meaning-match': return meaningMatch(idiom, all)
    case 'context-usage': return contextUsage(idiom, all)
    case 'production': return production(idiom)
  }
}

export function buildQueue(idioms: Idiom[], limit: number): Idiom[] {
  const now = Date.now()
  const order = { new: 0, learning: 1, mastered: 2 }
  const sorted = [...idioms].sort((a, b) => order[a.status] - order[b.status] || (a.nextDue ?? 0) - (b.nextDue ?? 0))
  const due = sorted.filter(i => !i.nextDue || i.nextDue <= now)
  const rest = sorted.filter(i => i.nextDue && i.nextDue > now)
  return [...due, ...rest].slice(0, limit)
}
